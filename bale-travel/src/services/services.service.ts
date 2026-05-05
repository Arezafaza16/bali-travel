import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceAvailability, ServiceDocument } from './service.schema';

const SERVICES_CONFIG = {
  'white-water-rafting': { name: 'Premium White Water Rafting', capacity: 20 },
  watersport: { name: 'Elite Watersport Experience', capacity: 30 },
  'atv-quad-bike': { name: 'Off-Road Jungle Expedition', capacity: 15 },
  'one-day-tour': { name: 'Bespoke Island Heritage Tour', capacity: 10 },
};

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(ServiceAvailability.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async onModuleInit() {
    // Seed services into DB if they don't exist yet
    for (const [slug, config] of Object.entries(SERVICES_CONFIG)) {
      await this.serviceModel.findOneAndUpdate(
        { serviceSlug: slug },
        {
          $setOnInsert: {
            serviceSlug: slug,
            serviceName: config.name,
            totalCapacity: config.capacity,
            bookedSlots: {},
          },
        },
        { upsert: true, new: true },
      );
    }
  }

  async checkAvailability(slug: string, date: string, guests: number) {
    if (!date) {
      return { available: false, message: 'Date is required', slotsLeft: 0 };
    }

    const service = await this.serviceModel.findOne({ serviceSlug: slug });
    if (!service) {
      throw new NotFoundException(`Service "${slug}" not found`);
    }

    const booked = service.bookedSlots.get(date) || 0;
    const slotsLeft = service.totalCapacity - booked;
    const available = slotsLeft >= guests;

    return {
      available,
      slotsLeft,
      totalCapacity: service.totalCapacity,
      alreadyBooked: booked,
      requestedGuests: guests,
      message: available
        ? `${slotsLeft} spots remaining on ${date}`
        : `Only ${slotsLeft} spots left — not enough for ${guests} guests`,
    };
  }

  async reserveSlots(slug: string, date: string, guests: number) {
    const service = await this.serviceModel.findOne({ serviceSlug: slug });
    if (!service) throw new NotFoundException(`Service "${slug}" not found`);

    const booked = service.bookedSlots.get(date) || 0;
    const newBooked = booked + guests;
    service.bookedSlots.set(date, newBooked);
    service.markModified('bookedSlots');
    await service.save();
    return service;
  }

  async getAllServices() {
    return this.serviceModel.find();
  }
}
