import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from '../dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notify-email')
  async handleEmailNotification(@Payload() data: NotifyEmailDto) {
    console.log('Received email notification:', data);
    this.notificationsService.notifyEmail(data);
  }
}
