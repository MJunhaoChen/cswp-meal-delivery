import { AddProductIds } from '@md/data';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ProductListService } from './productlist.service';

@Controller('productlist')
@UseGuards(RolesGuard)
export class ProductListController {
  constructor(private readonly productListService: ProductListService) {}

  @Post('')
  @Roles('owner', 'admin')
  async addProductToMeal(@Body() addId: AddProductIds) {
    await this.productListService.addProductToMeal(
      addId.productId,
      addId.mealId
    );
  }

  @Delete(':id')
  @Roles('owner', 'admin')
  async removeProductFromMeal(
    @Query('productIds') productIds: string,
    @Param('id') mealId: string
  ) {
    await this.productListService.removeProductFromMeal(
      productIds.split(','),
      mealId
    );
  }
}
