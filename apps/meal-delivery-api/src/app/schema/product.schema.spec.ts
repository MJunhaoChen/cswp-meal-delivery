import { Test } from '@nestjs/testing';

import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validate, version } from 'uuid';

import { Product, ProductDocument, ProductSchema } from './product.schema';

describe('Product Schema', () => {
  let mongod: MongoMemoryServer;
  let productModel: Model<ProductDocument>;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            return { uri };
          },
        }),
        MongooseModule.forFeature([
          { name: Product.name, schema: ProductSchema },
        ]),
      ],
    }).compile();

    productModel = app.get<Model<ProductDocument>>(getModelToken(Product.name));

    await productModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  it('has a default uuid v4 as id', () => {
    const model = new productModel();

    expect(validate(model.id)).toBeTruthy();
    expect(version(model.id)).toBe(4);
  });

  it('has a required name', () => {
    const model = new productModel();

    const err = model.validateSync();

    expect(err!.errors.name).toBeInstanceOf(Error);
  });
});
