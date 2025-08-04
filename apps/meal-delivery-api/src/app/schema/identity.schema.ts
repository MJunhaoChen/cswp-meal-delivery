import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IdentityDocument = Identity & Document;

@Schema()
export class Identity {
  @Prop({ type: String, required: true }) username!: string;
  @Prop({ type: String, required: true }) hash!: string;
  @Prop({ type: String, required: true, unique: true }) emailAddress!: string;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
