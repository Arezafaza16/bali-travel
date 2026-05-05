import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = ServiceAvailability & Document;

@Schema({ timestamps: true })
export class ServiceAvailability {
  @Prop({ required: true, unique: true })
  serviceSlug: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true, default: 20 })
  totalCapacity: number;

  @Prop({ type: Map, of: Number, default: {} })
  // key: "YYYY-MM-DD", value: bookedSlots
  bookedSlots: Map<string, number>;
}

export const ServiceAvailabilitySchema =
  SchemaFactory.createForClass(ServiceAvailability);
