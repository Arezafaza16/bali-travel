import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendBookingNotification(booking: any) {
    const adminNumber = this.configService.get<string>('ADMIN_WHATSAPP_NUMBER');
    const token = this.configService.get<string>('FONNTE_TOKEN');

    if (!adminNumber || !token) {
      this.logger.warn(
        'Fonnte credentials not configured — skipping WA notification. ' +
          'Set FONNTE_TOKEN and ADMIN_WHATSAPP_NUMBER in .env',
      );
      return;
    }

    const message = this.buildMessage(booking);
    await this.sendViaFonnte(token, adminNumber, message);
  }

  private buildMessage(booking: any): string {
    return (
      `🌴 *NEW BOOKING — Bali Concierge*\n\n` +
      `📋 *Service:* ${booking.serviceName}\n` +
      `📅 *Date:* ${booking.date}\n` +
      `👥 *Guests:* ${booking.guests}\n` +
      `👤 *Customer:* ${booking.customerName}\n` +
      `📞 *Phone:* ${booking.customerPhone}\n` +
      `📧 *Email:* ${booking.customerEmail}\n` +
      `💰 *Total:* Rp ${Number(booking.totalPrice).toLocaleString('id-ID')}\n` +
      `🔑 *OTP:* *${booking.otp}*\n` +
      `🆔 *Order ID:* ${booking.orderId}`
    );
  }

  private async sendViaFonnte(
    token: string,
    target: string,
    message: string,
  ) {
    try {
      const response = await axios.post(
        'https://api.fonnte.com/send',
        {
          target,           // phone number, e.g. "628123456789"
          message,
          countryCode: '62', // Indonesia default — change if needed
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status === false) {
        this.logger.error(
          `Fonnte error: ${JSON.stringify(response.data)}`,
        );
      } else {
        this.logger.log(`✅ WhatsApp notification sent to ${target} via Fonnte`);
      }
    } catch (error: any) {
      // Best-effort — payment already succeeded, don't crash
      this.logger.error(
        'Failed to send WhatsApp notification via Fonnte',
        error?.response?.data ?? error?.message,
      );
    }
  }
}
