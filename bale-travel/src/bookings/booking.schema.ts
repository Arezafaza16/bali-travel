import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

export type BookingStatus =
  | 'pending'
  | 'paid'
  | 'cancelled'
  | 'expired';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  serviceSlug: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  guests: number;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending' })
  status: BookingStatus;

  @Prop({ unique: true, sparse: true })
  orderId: string;

  @Prop()
  midtransToken: string;

  @Prop()
  midtransRedirectUrl: string;

  @Prop()
  otp: string;

  @Prop()
  paidAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
