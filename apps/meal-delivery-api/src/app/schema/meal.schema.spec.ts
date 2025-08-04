import { Test } from '@nestjs/testing';

import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validate, version } from 'uuid';

import { Meal, MealDocument, MealSchema } from './meal.schema';

describe('Meal Schema', () => {
  let mongod: MongoMemoryServer;
  let mealModel: Model<MealDocument>;

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
        MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
      ],
    }).compile();

    mealModel = app.get<Model<MealDocument>>(getModelToken(Meal.name));

    await mealModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  it('has a default uuid v4 as id', () => {
    const model = new mealModel();

    expect(validate(model.id)).toBeTruthy();
    expect(version(model.id)).toBe(4);
  });

  it('has a required name', () => {
    const model = new mealModel();

    const err = model.validateSync();

    expect(err!.errors.name).toBeInstanceOf(Error);
  });
});
