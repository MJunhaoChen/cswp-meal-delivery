import { UserRegistration } from '@md/data';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: TestingModule;
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          // mock the auth service, to avoid providing its dependencies
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            registerUser: jest.fn(),
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    let exampleUser, exampleId, register, create;

    beforeEach(() => {
      exampleUser = {
        username: 'bastiaan',
        password: 'secret1',
        emailAddress: 'bastiaan@hotmail.com',
        isGraduated: false,
      };
      exampleId = 'c816750b-3290-4223-bb38-0d34e23d7757';

      create = jest
        .spyOn(authService, 'createUser')
        .mockImplementation(
          async (_u: string, _e: string, _i: boolean, _p: string) => {
            return exampleId;
          }
        );
    });

    it('should not call create on failed register (duplicate username)', async () => {
      register = jest
        .spyOn(authService, 'registerUser')
        .mockImplementation(async (_c: UserRegistration) => {
          throw new Error('duplicate user');
        });

      await expect(authController.register(exampleUser)).rejects.toThrow();
      expect(create).not.toHaveBeenCalled();
    });
  });
});
