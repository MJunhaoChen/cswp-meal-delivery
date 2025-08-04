import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ type: String, default: uuid, index: true }) id: string;
  @Prop({ type: String, required: true }) name: string;
  @Prop({ type: Array, required: false, default: [] }) allergies: string[];
  @Prop({ type: Boolean, required: false, default: false })
  containsAlcohol: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
