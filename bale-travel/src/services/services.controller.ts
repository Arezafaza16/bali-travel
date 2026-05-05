import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get(':slug/availability')
  async checkAvailability(
    @Param('slug') slug: string,
    @Query('date') date: string,
    @Query('guests') guests: string,
  ) {
    return this.servicesService.checkAvailability(
      slug,
      date,
      parseInt(guests, 10) || 1,
    );
  }

  @Get()
  async getAllAvailability() {
    return this.servicesService.getAllServices();
  }
}
