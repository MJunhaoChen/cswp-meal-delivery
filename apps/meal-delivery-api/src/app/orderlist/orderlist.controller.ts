import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { OrderListService } from './orderlist.service';
import { InjectToken, Token } from '../auth/token.decorator';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orderlist')
@UseGuards(RolesGuard)
export class OrderListController {
  constructor(private readonly orderListService: OrderListService) {}

  @Post(':id')
  @Roles('student')
  async addMealToUser(
    @InjectToken() token: Token,
    @Param('id') mealId: string
  ) {
    await this.orderListService.addMealToUser(mealId, token.id);
  }

  @Delete(':id')
  @Roles('student')
  async removeMealFromUser(
    @InjectToken() token: Token,
    @Param('id') mealId: string
  ) {
    await this.orderListService.removeMealFromUser(mealId, token.id);
  }
}
