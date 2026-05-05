import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string) {
    return this.bookingsService.findByOrderId(orderId);
  }

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }
}
