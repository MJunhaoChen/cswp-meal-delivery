import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Product as ProductModel,
  ProductDocument,
} from '../schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ProductInfo, ResourceId } from '@md/data';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name)
    private productModel: Model<ProductDocument>
  ) {}

  async createProduct(productInfo: ProductInfo): Promise<ResourceId> {
    const product = new this.productModel({
      id: productInfo.id,
      name: productInfo.name,
      allergies: productInfo.allergies,
      containsAlcohol: productInfo.containsAlcohol,
    });
    await product.save();
    return product.id;
  }

  async getAll(): Promise<ProductInfo[]> {
    return this.productModel.find({}, { _id: 0, __v: 0 });
  }

  async getOne(productId: string): Promise<ProductInfo> {
    const products = await this.productModel.aggregate([
      { $match: { id: productId } },
    ]);
    return products[0];
  }

  async updateProduct(
    productId: string,
    productInfo: ProductInfo
  ): Promise<ProductInfo> {
    const product = await this.productModel.findOne({ id: productId });

    if (product) {
      try {
        await this.productModel.updateOne({ id: productId }, [
          {
            $set: {
              id: productId,
              name: productInfo.name,
              allergies: productInfo.allergies,
              containsAlcohol: productInfo.containsAlcohol,
            },
          },
        ]);
      } catch (e) {
        let errorMessage = 'Failed to do something exceptional';
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
    }

    return productInfo;
  }

  async deleteOne(productId: string) {
    const product = await this.getOne(productId);
    if (product) {
      await this.productModel.deleteOne({ id: productId });
    } else {
      throw new HttpException('Product does not exist', HttpStatus.BAD_REQUEST);
    }
  }
}
