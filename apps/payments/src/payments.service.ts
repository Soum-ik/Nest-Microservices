import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_API_KEY')!);
  constructor(private readonly configService: ConfigService) {}

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

  async verifyPaymentSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      metadata: session.metadata,
      isPaid: session.payment_status === 'paid',
    };
  }
}
