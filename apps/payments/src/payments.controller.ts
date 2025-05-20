import { BadRequestException, Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { Request } from 'express';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create-checkout-session')
  async createCheckoutSession(@Payload() data: { amount: number; email: string; metadata: Record<string, string> }) {
    return this.paymentsService.createCheckoutSession(data.amount, data.email, data.metadata);
  }

  // Updated webhook handler to use raw request body
  @Post('webhook')
  async handleWebhook(@Req() request: Request, @Headers('stripe-signature') signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing stripe signature');
    }
    
    // Raw body is available because we used bodyParser.raw() middleware
    return this.paymentsService.handleWebhook(request.body, signature);
  }
}
