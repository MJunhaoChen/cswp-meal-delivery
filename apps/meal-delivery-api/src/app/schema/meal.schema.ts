import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Product, ProductSchema } from './product.schema';
import { StudentHouse, StudentHouseSchema } from './studentHouse.schema';
import { User } from './user.schema';

export type MealDocument = HydratedDocument<Meal>;

@Schema()
export class Meal {
  @Prop({ type: String, default: uuid, index: true }) id: string;
  @Prop({ type: String, required: true }) name: string;
  @Prop({ type: Number, default: 0.01 }) price: number;
  @Prop({ type: Date, default: new Date() }) deliveryTime: Date;
  @Prop({ type: Date, default: new Date() }) deliveryDate: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    // cannot use Meal.owner here, as it leads to a circular dependency
    ref: 'User',
    required: true,
  })
  ownerRef: User;

  @Prop({ type: StudentHouseSchema })
  studentHouse: StudentHouse;

  @Prop({ type: [ProductSchema], default: [] })
  products: Product[];
}

export const MealSchema = SchemaFactory.createForClass(Meal);
