import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create-checkout-session')
  async createCheckoutSession(@Payload() data: { amount: number; email: string; metadata: Record<string, string> }) {
    return this.paymentsService.createCheckoutSession(data.amount, data.email, data.metadata);
  }

  @MessagePattern('verify-payment')
  async verifyPayment(@Payload() data: { sessionId: string }) {
    return this.paymentsService.verifyPaymentSession(data.sessionId);
  }
}
