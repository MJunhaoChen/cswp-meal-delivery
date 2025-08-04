import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { MealInfo, ResourceId } from '@md/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('meal')
@UseGuards(RolesGuard)
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @Roles('owner', 'admin')
  async createMeal(
    @InjectToken() token: Token,
    @Body() meal: MealInfo
  ): Promise<ResourceId> {
    try {
      return await this.mealService.createMeal(meal, token.id);
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAll(): Promise<MealInfo[]> {
    return this.mealService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<MealInfo> {
    return this.mealService.getOne(id);
  }

  @Put(':id')
  @Roles('owner', 'admin')
  async updateMeal(
    @InjectToken() token: Token,
    @Param('id') mealId: string,
    @Body() meal: MealInfo
  ): Promise<MealInfo> {
    try {
      return this.mealService.updateMeal(mealId, meal, token.id);
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles('owner', 'admin')
  async deleteMeal(@InjectToken() token: Token, @Param('id') id: string) {
    await this.mealService.deleteOne(id, token.id);
  }
}
