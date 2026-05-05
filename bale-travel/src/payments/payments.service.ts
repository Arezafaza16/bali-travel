import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import { BookingsService } from '../bookings/bookings.service';
import { ServicesService } from '../services/services.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class PaymentsService {
  private snap: midtransClient.Snap;

  constructor(
    private readonly configService: ConfigService,
    private readonly bookingsService: BookingsService,
    private readonly servicesService: ServicesService,
    private readonly whatsappService: WhatsappService,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction:
        this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true',
      serverKey: this.configService.get<string>('MIDTRANS_SERVER_KEY'),
    });
  }

  async createTransaction(orderId: string) {
    const booking = await this.bookingsService.findByOrderId(orderId);
    if (!booking) {
      throw new BadRequestException('Booking not found');
    }
    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending state');
    }

    const parameter = {
      transaction_details: {
        order_id: booking.orderId,
        gross_amount: booking.totalPrice,
      },
      customer_details: {
        first_name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
      },
      item_details: [
        {
          id: booking.serviceSlug,
          price: Math.round(booking.totalPrice / booking.guests),
          quantity: booking.guests,
          name: booking.serviceName,
        },
      ],
    };

    const transaction = await this.snap.createTransaction(parameter);

    // Save token to booking
    booking.midtransToken = transaction.token;
    booking.midtransRedirectUrl = transaction.redirect_url;
    await booking.save();

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId: booking.orderId,
      clientKey: this.configService.get<string>('MIDTRANS_CLIENT_KEY'),
    };
  }

  async handleNotification(notification: any) {
    const statusResponse =
      await this.snap.transaction.notification(notification);

    const { order_id, transaction_status, fraud_status } = statusResponse;

    const booking = await this.bookingsService.findByOrderId(order_id);
    if (!booking) return { message: 'Booking not found' };

    let paid = false;

    if (transaction_status === 'capture') {
      paid = fraud_status === 'accept';
    } else if (transaction_status === 'settlement') {
      paid = true;
    } else if (
      ['cancel', 'deny', 'expire'].includes(transaction_status)
    ) {
      booking.status = 'cancelled';
      await booking.save();
      return { message: 'Payment cancelled' };
    }

    if (paid && booking.status !== 'paid') {
      const updatedBooking = await this.bookingsService.markAsPaid(order_id);

      // Reserve slots in availability
      await this.servicesService.reserveSlots(
        booking.serviceSlug,
        booking.date,
        booking.guests,
      );

      // Send WhatsApp notification to admin
      await this.whatsappService.sendBookingNotification(updatedBooking);

      return { message: 'Payment confirmed', otp: updatedBooking.otp };
    }

    return { message: `Status: ${transaction_status}` };
  }

  async getBookingStatus(orderId: string) {
    let booking = await this.bookingsService.findByOrderId(orderId);
    if (!booking) throw new BadRequestException('Booking not found');

    // Proactively check Midtrans if status is still pending 
    // This is crucial for local development where Midtrans webhooks cannot reach localhost
    if (booking.status === 'pending') {
      try {
        const midtransStatus = await this.snap.transaction.status(orderId);
        if (midtransStatus) {
          await this.handleNotification(midtransStatus);
          // Re-fetch the booking after handling the notification
          const updated = await this.bookingsService.findByOrderId(orderId);
          if (updated) booking = updated;
        }
      } catch (error) {
        // Ignore errors (e.g. 404 if transaction not yet created in Midtrans)
      }
    }

    return {
      status: booking.status,
      otp: booking.status === 'paid' ? booking.otp : null,
      orderId: booking.orderId,
    };
  }
}
