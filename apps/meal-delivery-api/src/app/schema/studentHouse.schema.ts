import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type StudentHouseDocument = HydratedDocument<StudentHouse>;

@Schema()
export class StudentHouse {
  @Prop({ type: String, default: uuid, index: true }) id: string;
  @Prop({ type: String, required: true })
  streetAndNmr: string;
  @Prop({ type: String, required: false }) city: string;
  @Prop({ type: String, required: false }) postcode: string;
}

export const StudentHouseSchema = SchemaFactory.createForClass(StudentHouse);
