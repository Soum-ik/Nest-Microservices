import { ConfigService } from '@nestjs/config';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RESERVATIONS_SERVICE } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_API_KEY')!);
  
  constructor(
    private readonly configService: ConfigService,
    @Inject(RESERVATIONS_SERVICE) private readonly reservationsService: ClientProxy
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
      metadata, // Store reservation details here
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(payload: any, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
      }
      
      return { received: true };
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
  
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (session.metadata?.reservationId) {
      this.reservationsService.emit('confirm-reservation-payment', {
        sessionId: session.id,
        reservationId: session.metadata.reservationId,
        userId: session.metadata.userId,
        status: 'confirmed'
      });
    }
  }
  
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);
  }
}
