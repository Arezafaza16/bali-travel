import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceAvailability, ServiceAvailabilitySchema } from './service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceAvailability.name, schema: ServiceAvailabilitySchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
