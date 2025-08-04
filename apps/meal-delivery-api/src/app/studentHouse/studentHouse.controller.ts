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
import { StudentHouseService } from './studentHouse.service';
import { StudentHouseInfo, ResourceId } from '@md/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { Roles } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('studentHouse')
@UseGuards(RolesGuard)
export class StudentHouseController {
  constructor(private readonly studentHouseService: StudentHouseService) {}

  @Post()
  @Roles('owner', 'admin')
  async createStudentHouse(
    @Body() studentHouse: StudentHouseInfo
  ): Promise<ResourceId> {
    try {
      return await this.studentHouseService.createStudentHouse(studentHouse);
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAll(): Promise<StudentHouseInfo[]> {
    return this.studentHouseService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<StudentHouseInfo> {
    return this.studentHouseService.getOne(id);
  }

  @Put(':id')
  @Roles('owner', 'admin')
  async updateStudentHouse(
    @InjectToken() token: Token,
    @Param('id') studentHouseId: string,
    @Body() studentHouse: StudentHouseInfo
  ): Promise<StudentHouseInfo> {
    try {
      return this.studentHouseService.updateStudentHouse(
        studentHouseId,
        studentHouse,
        token.id
      );
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
  async deleteStudentHouse(@Param('id') id: string) {
    await this.studentHouseService.deleteOne(id);
  }
}
