import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create/:orderId')
  async createTransaction(@Param('orderId') orderId: string) {
    return this.paymentsService.createTransaction(orderId);
  }

  @Post('notification')
  async handleNotification(@Body() notification: any) {
    return this.paymentsService.handleNotification(notification);
  }

  @Get('status/:orderId')
  async getStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.getBookingStatus(orderId);
  }
}
