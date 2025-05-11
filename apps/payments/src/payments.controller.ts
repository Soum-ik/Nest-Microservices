import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';
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

  // Add webhook handler (exposed as HTTP endpoint)
  @Post('webhook')
  async handleWebhook(@Body() payload: any, @Headers('stripe-signature') signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing stripe signature');
    }

    return this.paymentsService.handleWebhook(payload, signature);
  }
}
