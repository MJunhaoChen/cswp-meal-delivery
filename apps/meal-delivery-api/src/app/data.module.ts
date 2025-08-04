import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Identity, IdentitySchema } from './schema/identity.schema';
import { MealController } from './meal/meal.controller';
import { Meal, MealSchema } from './schema/meal.schema';
import { MealService } from './meal/meal.service';
import { UserController } from './user/user.controller';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user/user.service';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { StudentHouse, StudentHouseSchema } from './schema/studentHouse.schema';
import { StudentHouseController } from './studentHouse/studentHouse.controller';
import { StudentHouseService } from './studentHouse/studentHouse.service';
import { OrderListService } from './orderlist/orderlist.service';
import { OrderListController } from './orderlist/orderlist.controller';
import { ProductListController } from './productlist/productlist.controller';
import { ProductListService } from './productlist/productlist.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identity.name, schema: IdentitySchema },
      { name: User.name, schema: UserSchema },
      { name: Meal.name, schema: MealSchema },
      { name: Product.name, schema: ProductSchema },
      { name: StudentHouse.name, schema: StudentHouseSchema },
    ]),
  ],
  controllers: [
    UserController,
    OrderListController,
    MealController,
    ProductController,
    ProductListController,
    StudentHouseController,
  ],
  providers: [
    UserService,
    OrderListService,
    MealService,
    ProductService,
    ProductListService,
    StudentHouseService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class DataModule {}
