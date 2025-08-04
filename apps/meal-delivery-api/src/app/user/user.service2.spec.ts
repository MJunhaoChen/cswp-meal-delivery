import { Test } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';
import { MongoClient } from 'mongodb';
import { UserService } from './user.service';
import { User, UserDocument, UserSchema } from '../schema/user.schema';
import { MealDocument, Meal, MealSchema } from '../schema/meal.schema';
import { Identity } from '../schema/identity.schema';
import { Neo4jService } from '../neo4j/neo4j.service';

describe('UserService', () => {
  let service: UserService;
  let neo4jService: Neo4jService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let userModel: Model<UserDocument>;
  let mealModel: Model<MealDocument>;

  const studentHouseMock = {
    id: '3412',
    streetAndNmr: 'Lovensdijkstraat 61',
    city: 'Breda',
    postcode: '12345',
  };

  const productMock1 = {
    id: 'feq491r31',
    name: 'Pizza',
    allergies: ['gluten'],
    containsAlcohol: false,
  };

  const productMock2 = {
    id: 'vaedea80f8ee1ff31',
    name: 'Burger',
    allergies: [],
    containsAlcohol: false,
  };

  const userMock1 = {
    id: 'veq9103dcfj13',
    username: 'jan',
    emailAddress: 'jan@hotmail.com',
    isGraduated: false,
    role: 'student',
    meals: [],
  };

  const userMock2 = {
    id: 'veq9103dwqdcfj13',
    username: 'dion',
    emailAddress: 'dion@hotmail.com',
    isGraduated: false,
    role: 'admin',
    meals: [],
  };

  const userMock3 = {
    id: 'veq9103vqedcfj13',
    username: 'davide',
    emailAddress: 'davide@hotmail.com',
    isGraduated: false,
    role: 'student',
    meals: [],
  };

  const mealMock1 = {
    id: '1234',
    name: 'Mock Meal',
    price: 9.99,
    deliveryTime: new Date('2023-04-07T18:00:00.000Z'),
    deliveryDate: new Date('2023-04-07T00:00:00.000Z'),
    ownerRef: userMock1,
    studentHouse: studentHouseMock,
    products: [productMock1, productMock2],
  };

  const mealMock2 = {
    id: '12345',
    name: 'Mock2 Meal',
    price: 9.99,
    deliveryTime: new Date('2023-04-07T18:00:00.000Z'),
    deliveryDate: new Date('2023-04-07T00:00:00.000Z'),
    ownerRef: userMock3,
    studentHouse: studentHouseMock,
    products: [productMock1, productMock2],
  };

  const mealMock3 = {
    id: '123456',
    name: 'Mock3 Meal',
    price: 9.99,
    deliveryTime: new Date('2023-04-07T18:00:00.000Z'),
    deliveryDate: new Date('2023-04-07T00:00:00.000Z'),
    ownerRef: userMock3,
    studentHouse: studentHouseMock,
    products: [productMock1, productMock2],
  };

  const testMeals = [mealMock1, mealMock2, mealMock3];

  const testUsers = [userMock1, userMock2, userMock3];

  beforeAll(async () => {
    let uri: string = '';

    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return { uri };
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
      ],
      providers: [
        UserService,
        {
          provide: Neo4jService,
          useValue: {
            singleWrite: jest.fn(),
            singleRead: jest.fn(),
          },
        },
        {
          provide: getModelToken(Identity.name),
          useValue: {
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = app.get<UserService>(UserService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    neo4jService = app.get<Neo4jService>(Neo4jService);
    mealModel = app.get<Model<MealDocument>>(getModelToken(Meal.name));

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('users').deleteMany({});
    await mongoc.db('test').collection('meals').deleteMany({});

    const user1 = new userModel(testUsers[0]);
    const user2 = new userModel(testUsers[1]);
    const user3 = new userModel(testUsers[2]);

    const meal1 = new mealModel({
      ...testMeals[0],
      ownerRef: user1._id,
    });
    const meal2 = new mealModel({
      ...testMeals[1],
      ownerRef: user3._id,
    });
    const meal3 = new mealModel({
      ...testMeals[2],
      ownerRef: user1._id,
    });

    user1.meals.push(meal1);
    user1.meals.push(meal2);
    user1.meals.push(meal3);
    user2.meals.push(meal1);
    user2.meals.push(meal3);
    user3.meals.push(meal2);

    await Promise.all([
      user1.save(),
      user2.save(),
      user3.save(),
      meal1.save(),
      meal2.save(),
      meal3.save(),
    ]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('getAll', () => {
    xit('should retrieve all users', async () => {
      const results = await service.getAll();

      expect(results).toHaveLength(3);
      expect(results.map((r) => r.username)).toContain('jan');
      expect(results.map((r) => r.username)).toContain('dion');
      expect(results.map((r) => r.username)).toContain('davide');
    });

    xit('should not give meals or studentHouse', async () => {
      it('executes correct cypher query in the neo4j service', async () => {
        const singleWrite = jest
          .spyOn(neo4jService, 'singleWrite')
          .mockImplementation();
      });

      const results = await service.getAll();
      console.log(results);

      expect(results[0]).not.toHaveProperty('meals');
      expect(results[0]).not.toHaveProperty('studentHouse');
    });
  });

  describe('getOne', () => {
    it('should retrieve a specific user', async () => {
      const result = await service.getOne('veq9103dcfj13');

      expect(result).toHaveProperty('username', 'jan');
    });

    it('returns null when user is not found', async () => {
      const result = await service.getOne('niemand');

      expect(result).toBeUndefined();
    });

    it('should not give meals', async () => {
      const result = await service.getOne('nomeals');

      expect(result).toBeUndefined();
    });

    it('gives all meals of this user', async () => {
      const result = await service.getOne('veq9103dcfj13');

      expect(result).toHaveProperty('meals');
      expect(result.meals).toHaveLength(3);
    });
  });
});
