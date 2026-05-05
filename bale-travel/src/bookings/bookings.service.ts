import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly servicesService: ServicesService,
  ) {}

  async create(dto: CreateBookingDto) {
    // Double-check availability before creating booking
    const availability = await this.servicesService.checkAvailability(
      dto.serviceSlug,
      dto.date,
      dto.guests,
    );

    if (!availability.available) {
      throw new BadRequestException(availability.message);
    }

    const orderId = `BC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const totalPrice = dto.pricePerPerson * dto.guests;

    const booking = new this.bookingModel({
      ...dto,
      totalPrice,
      orderId,
      status: 'pending',
    });

    return booking.save();
  }

  async findByOrderId(orderId: string) {
    return this.bookingModel.findOne({ orderId });
  }

  async markAsPaid(orderId: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const booking = await this.bookingModel.findOneAndUpdate(
      { orderId },
      { status: 'paid', otp, paidAt: new Date() },
      { new: true },
    );
    return booking;
  }

  async findAll() {
    return this.bookingModel.find().sort({ createdAt: -1 });
  }
}
