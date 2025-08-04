import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@md/data';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Meal, MealSchema } from './meal.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, default: uuid, index: true }) id: string;
  @Prop({ type: String, required: true }) username: string;
  @Prop({ type: String, required: true, unique: true }) emailAddress: string;
  @Prop({ type: Boolean, default: false }) isGraduated: boolean;
  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: string;

  @Prop({ type: [MealSchema], default: [] })
  meals: Meal[];
}

export const UserSchema = SchemaFactory.createForClass(User);
