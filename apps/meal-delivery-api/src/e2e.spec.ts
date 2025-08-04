import request = require('supertest');

import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { UserRegistration, UserRole } from '@md/data';

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';

import { AuthModule } from './app/auth/auth.module';
import { DataModule } from './app/data.module';
import { TokenMiddleware } from './app/auth/token.middleware';
import { ApiResponseInterceptor } from './app/api-response.interceptor';

let mongod: MongoMemoryServer;
let uri: string;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        return { uri };
      },
    }),
    AuthModule,
    DataModule,
    RouterModule.register([
      {
        path: 'auth-api',
        module: AuthModule,
      },
      {
        path: 'api',
        module: DataModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class TestAppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('api');
  }
}

describe('end-to-end tests of data API', () => {
  let app: INestApplication;
  let server;
  let module: TestingModule;
  let mongoc: MongoClient;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalInterceptors(new ApiResponseInterceptor());
    await app.init();

    mongoc = new MongoClient(uri);
    await mongoc.connect();

    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('identities').deleteMany({});
    await mongoc.db('test').collection('users').deleteMany({});
    await mongoc.db('test').collection('meals').deleteMany({});
    await mongoc.db('test').collection('products').deleteMany({});
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('single user', () => {
    let credentials: UserRegistration;

    beforeEach(() => {
      credentials = {
        username: 'henk',
        password: 'supersecret123',
        emailAddress: 'henk@mail.com',
        isGraduated: false,
        role: UserRole.STUDENT,
      };
    });

    xit('a user registers, logs in, and has no meals', async () => {
      const register = await request(server)
        .post('/auth-api/auth/register')
        .send(credentials);

      expect(register.status).toBe(201);
      expect(register.body).toHaveProperty('results');
      expect(register.body.results).toHaveProperty('id');
      expect(register.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });

      const login = await request(server)
        .post('/auth-api/auth/login')
        .send(credentials);

      expect(login.status).toBe(201);
      expect(login.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(login.body).toHaveProperty('results.token');

      const token = login.body.results.token;

      const meals = await request(server)
        .get('/api/meal')
        .set('authorization', token);

      expect(meals.status).toBe(200);
      expect(meals.body).toHaveProperty('info', {
        version: '1.0',
        type: 'list',
        count: 0,
      });
      expect(meals.body).toHaveProperty('results', []);
    });
  });

  describe('two users', () => {
    let credsA, credsB;

    beforeEach(() => {
      credsA = {
        username: 'dion',
        password: 'supergeheim123',
        emailAddress: 'dion@dion.nl',
      };

      credsB = {
        username: 'jan',
        password: 'supergeheim123',
        emailAddress: 'jan@jan.nl',
      };
    });

    xit('two users register, log in, get list of users and their own account info', async () => {
      const registerA = await request(server)
        .post('/auth-api/auth/register')
        .send(credsA);

      expect(registerA.status).toBe(201);
      expect(registerA.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(registerA.body).toHaveProperty('results.id');

      const registerB = await request(server)
        .post('/auth-api/auth/register')
        .send(credsB);

      expect(registerB.status).toBe(201);
      expect(registerB.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(registerB.body).toHaveProperty('results.id');

      const loginA = await request(server)
        .post('/auth-api/auth/login')
        .send(credsA);

      expect(loginA.status).toBe(201);
      expect(loginA.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(loginA.body).toHaveProperty('results.token');

      const loginB = await request(server)
        .post('/auth-api/auth/login')
        .send(credsB);

      expect(loginB.status).toBe(201);
      expect(loginB.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(loginB.body).toHaveProperty('results.token');

      const tokenA = loginA.body.results.token;
      const tokenB = loginB.body.results.token;

      const getUserListA = await request(server)
        .get('/api/user')
        .set('authorization', tokenA);

      expect(getUserListA.status).toBe(200);
      expect(getUserListA.body).toHaveProperty('info', {
        version: '1.0',
        type: 'list',
        count: 2,
      });
      expect(getUserListA.body).toHaveProperty('results');
      expect(getUserListA.body.results).toHaveLength(2);
      expect(getUserListA.body.results[0]).toHaveProperty('id');
      expect(getUserListA.body.results[0]).toHaveProperty('name');
      expect(getUserListA.body.results[0]).toHaveProperty('emailAddress');
      expect(getUserListA.body.results.map((u) => u.name)).toContain(
        credsA.username
      );
      expect(getUserListA.body.results.map((u) => u.name)).toContain(
        credsB.username
      );

      const getUserListB = await request(server)
        .get('/api/user')
        .set('authorization', tokenB);

      expect(getUserListB.status).toBe(200);
      expect(getUserListB.body).toHaveProperty('info', {
        version: '1.0',
        type: 'list',
        count: 2,
      });
      expect(getUserListB.body).toHaveProperty('results');
      expect(getUserListB.body.results).toHaveLength(2);
      expect(getUserListB.body.results[0]).toHaveProperty('id');
      expect(getUserListB.body.results[0]).toHaveProperty('name');
      expect(getUserListB.body.results[0]).toHaveProperty('emailAddress');
      expect(getUserListB.body.results.map((u) => u.name)).toContain(
        credsA.username
      );
      expect(getUserListB.body.results.map((u) => u.name)).toContain(
        credsB.username
      );

      const getSelfA = await request(server)
        .get('/api/user/self')
        .set('authorization', tokenA);

      expect(getSelfA.status).toBe(200);
      expect(getSelfA.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(getSelfA.body).toHaveProperty('results');
      expect(getSelfA.body.results).toHaveProperty('id');
      expect(getSelfA.body.results).toHaveProperty('name', credsA.username);
      expect(getSelfA.body.results).toHaveProperty(
        'emailAddress',
        credsA.emailAddress
      );

      const getSelfB = await request(server)
        .get('/api/user/self')
        .set('authorization', tokenB);

      expect(getSelfB.status).toBe(200);
      expect(getSelfB.body).toHaveProperty('info', {
        version: '1.0',
        type: 'object',
        count: 1,
      });
      expect(getSelfB.body).toHaveProperty('results');
      expect(getSelfB.body.results).toHaveProperty('id');
      expect(getSelfB.body.results).toHaveProperty('name', credsB.username);
      expect(getSelfB.body.results).toHaveProperty(
        'emailAddress',
        credsB.emailAddress
      );
    });
  });
});
