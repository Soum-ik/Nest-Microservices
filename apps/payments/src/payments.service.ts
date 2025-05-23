import { ConfigService } from '@nestjs/config';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE, RESERVATIONS_SERVICE } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_API_KEY')!);

  constructor(
    private readonly configService: ConfigService,
    @Inject(RESERVATIONS_SERVICE) private readonly reservationsService: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
  ) {}

  async createCheckoutSession(amount: number, email: string, metadata: Record<string, string>) {
    const session = await this.stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Reservation',
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_URL')}/reservation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/reservation/cancel`,
      metadata: {
        ...metadata,
        email, // Add email to metadata
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(rawBody: any, signature: string) {
    try {
      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

      if (!webhookSecret) {
        throw new BadRequestException('Missing STRIPE_WEBHOOK_SECRET in configuration');
      }

      // Construct the event by verifying signature
      let event;
      try {
        event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
      }

      console.log('Verified stripe event:', event.type);

      // Handle the event based on its type
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.error(`Webhook error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (session.metadata?.reservationId) {
      this.reservationsService.emit('confirm-reservation-payment', {
        sessionId: session.id,
        reservationId: session.metadata.reservationId,
        userId: session.metadata.userId,
        status: 'confirmed',
      });
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);
    console.log(paymentIntent, 'PaymentIntent details');
    
    
    // Get the email from payment intent metadata or from the related customer
    const email = paymentIntent.metadata?.email || paymentIntent.receipt_email || '';
    console.log(`Email from payment intent: ${email}`);
    
    try {
      if (email) {
        this.notificationsService.emit('notify-email', {
          email: email,
          text: `Payment for reservation ${paymentIntent.amount != null ? (paymentIntent.amount / 100) + '$' : 'unknown'} was successful.`,
        });
        console.log(`Notification sent to: ${email}`);
      } else {
        console.warn('No email found in payment intent, notification not sent');
      }
    } catch (error) {
      console.error('Failed to emit notification event:', error.message);
      // The webhook should still return success even if notification fails
    }
  }
}
