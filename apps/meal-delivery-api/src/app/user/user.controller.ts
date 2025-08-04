import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from '@md/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('owner', 'admin')
  async getAll(): Promise<UserInfo[]> {
    return this.userService.getAll();
  }

  @Get('self')
  async getSelf(@InjectToken() token: Token): Promise<UserInfo> {
    const result = await this.userService.getOneByName(token.username);
    return result;
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserInfo> {
    return this.userService.getOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async updateUser(
    @Param('id') userId: string,
    @Body() user: UserInfo
  ): Promise<UserInfo> {
    try {
      return this.userService.updateUser(userId, user);
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('self')
  async deleteSelf(@InjectToken() token: Token) {
    await this.userService.deleteOne(token.id);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteOne(id);
  }
}
