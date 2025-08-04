import { Test } from '@nestjs/testing';

import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validate, version } from 'uuid';

import {
  StudentHouse,
  StudentHouseDocument,
  StudentHouseSchema,
} from './studentHouse.schema';

describe('StudentHouse Schema', () => {
  let mongod: MongoMemoryServer;
  let studentHouseModel: Model<StudentHouseDocument>;

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
          { name: StudentHouse.name, schema: StudentHouseSchema },
        ]),
      ],
    }).compile();

    studentHouseModel = app.get<Model<StudentHouseDocument>>(
      getModelToken(StudentHouse.name)
    );

    await studentHouseModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  it('has a default uuid v4 as id', () => {
    const model = new studentHouseModel();

    expect(validate(model.id)).toBeTruthy();
    expect(version(model.id)).toBe(4);
  });

  it('has a required streetAndNmr', () => {
    const model = new studentHouseModel();

    const err = model.validateSync();

    expect(err!.errors.streetAndNmr).toBeInstanceOf(Error);
  });
});
