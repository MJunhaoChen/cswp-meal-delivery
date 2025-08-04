import { Test } from '@nestjs/testing';
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validate, version } from 'uuid';

import { User, UserDocument, UserSchema } from './user.schema';
import { Meal, MealDocument, MealSchema } from './meal.schema';
import { UserRole } from '@md/data';

describe('User Schema', () => {
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;
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
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Meal.name, schema: MealSchema },
        ]),
      ],
    }).compile();

    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    mealModel = app.get<Model<MealDocument>>(getModelToken(Meal.name));

    await userModel.ensureIndexes();
    await mealModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  it('has a default uuid v4 as id', () => {
    const model = new userModel();

    expect(validate(model.id)).toBeTruthy();
    expect(version(model.id)).toBe(4);
  });

  it('has a required username', () => {
    const model = new userModel();

    const err = model.validateSync();

    expect(err!.errors.username).toBeInstanceOf(Error);
  });

  it('has a required emailAddress', () => {
    const model = new userModel();

    const err = model.validateSync();

    expect(err!.errors.emailAddress).toBeInstanceOf(Error);
  });

  it('has a unique email', async () => {
    const original = new userModel({
      username: 'samename',
      hash: 'h123',
      emailAddress: 'same@mail.com',
    });
    const duplicate = new userModel({
      username: 'othername',
      hash: 'h456',
      emailAddress: 'same@mail.com',
    });

    await original.save();

    await expect(duplicate.save()).rejects.toThrow();
  });

  it('has a default isGraduated of false', () => {
    const model = new userModel();

    expect(model.isGraduated).toBe(false);
  });

  it('has a default role of UserRole.STUDENT', () => {
    const model = new userModel();

    expect(model.role).toBe('student');
  });

  it('has an empty array of meals by default', () => {
    const model = new userModel();

    expect(model.meals).toEqual([]);
  });

  it('has a meals property that contains Meal documents', async () => {
    const user = new userModel({
      username: 'testuser',
      emailAddress: 'testuser@example.com',
      role: UserRole.STUDENT,
    });
    await user.save();

    const meal = new mealModel({
      name: 'Pizza',
      ownerRef: user._id,
    });
    await meal.save();

    user.meals = [meal];
    await user.save();

    const foundUser = await userModel
      .findOne({ _id: user._id })
      .populate('meals');

    expect(foundUser!.meals[0].name).toEqual(meal.name);
  });
});
