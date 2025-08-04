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
import { ProductService } from './product.service';
import { ProductInfo, ResourceId } from '@md/data';
import { InjectToken, Token } from '../auth/token.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/role.decorator';

@Controller('product')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('owner', 'admin')
  async createProduct(@Body() product: ProductInfo): Promise<ResourceId> {
    try {
      return await this.productService.createProduct(product);
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAll(): Promise<ProductInfo[]> {
    return this.productService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ProductInfo> {
    return this.productService.getOne(id);
  }

  @Put(':id')
  @Roles('owner', 'admin')
  async updateProduct(
    @InjectToken() token: Token,
    @Param('id') productId: string,
    @Body() product: ProductInfo
  ): Promise<ProductInfo> {
    try {
      return this.productService.updateProduct(productId, product);
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
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteOne(id);
  }
}
