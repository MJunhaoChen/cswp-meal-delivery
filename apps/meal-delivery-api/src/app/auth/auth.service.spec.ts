import { Test } from '@nestjs/testing';

import { MongooseModule } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { hashSync } from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { MongoClient } from 'mongodb';

import { AuthService } from './auth.service';
import { Identity, IdentitySchema } from '../schema/identity.schema';
import { User, UserSchema } from '../schema/user.schema';
import { UserRegistration, UserRole } from '@md/data';
import { Neo4jService } from '../neo4j/neo4j.service';

describe('AuthService', () => {
  let service: AuthService;
  let neo4jService: Neo4jService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;

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
        MongooseModule.forFeature([
          { name: Identity.name, schema: IdentitySchema },
        ]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        AuthService,
        {
          provide: Neo4jService,
          useValue: {
            singleWrite: jest.fn(),
          },
        },
      ],
    }).compile();

    neo4jService = app.get<Neo4jService>(Neo4jService);
    service = app.get<AuthService>(AuthService);

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').dropDatabase();
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('create', () => {
    xit('should create a new user', async () => {
      const exampleUser = {
        username: 'mario',
        emailAddress: 'mario@mario.nl',
        isGraduated: false,
        role: 'student',
      };

      await service.createUser(
        exampleUser.username,
        exampleUser.emailAddress,
        exampleUser.isGraduated,
        exampleUser.role
      );

      const found = await mongoc
        .db('test')
        .collection('users')
        .findOne({ username: exampleUser.username });

      expect(found?.username).toBe(exampleUser.username);
    });
  });

  describe('verify token', () => {
    it('should accept a valid token', async () => {
      const examplePayload = { user: 'userid' };

      const token = sign(examplePayload, `${process.env.JWT_SECRET}`);

      const verifiedToken = await service.verifyToken(token);

      expect(verifiedToken).toHaveProperty('user', examplePayload.user);
    });

    it('should throw on invalid token', async () => {
      const token = 'fake.fake.fake';

      await expect(service.verifyToken(token)).rejects.toThrow();
    });
  });

  describe('generate token', () => {
    xit('should generate a token with user id', async () => {
      const exampleUser = {
        username: 'testuser',
        password: 'secret1',
      };

      await mongoc
        .db('test')
        .collection('identities')
        .insertOne({
          username: exampleUser.username,
          hash: hashSync(
            exampleUser.password,
            parseInt(`${process.env.SALT_ROUNDS}`, 10)
          ),
        });
      await mongoc.db('test').collection('users').insertOne({
        name: exampleUser.username,
        id: 'id12345',
      });

      const token = await service.generateToken(
        exampleUser.username,
        exampleUser.password
      );
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should throw when user is not found', async () => {
      await expect(
        service.generateToken('notfound', 'verysecret')
      ).rejects.toThrow();
    });

    it('should throw when user supplied incorrect password', async () => {
      const exampleUser = { username: 'harie', password: 'password1' };

      await mongoc
        .db('test')
        .collection('identities')
        .insertOne({
          username: exampleUser.username,
          hash: hashSync(
            exampleUser.password,
            parseInt(`${process.env.SALT_ROUNDS}`, 10)
          ),
        });

      await expect(
        service.generateToken(exampleUser.username, exampleUser.password + '2')
      ).rejects.toThrow();
    });
  });

  describe('register user', () => {
    it('should register a new user', async () => {
      const exampleUser = {
        username: 'henk',
        password: 'supersecret123',
        emailAddress: 'henk@mail.com',
        role: UserRole.STUDENT,
      } as UserRegistration;

      await service.registerUser(exampleUser);

      const record = await mongoc
        .db('test')
        .collection('identities')
        .findOne({ username: exampleUser.username });

      expect(record).toHaveProperty('username', exampleUser.username);
      expect(record).toHaveProperty('hash');
    });
  });
});
