import { Test } from '@nestjs/testing';
import { UserInfo } from '@md/data';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getSelf: jest.fn(),
            getOne: jest.fn(),
            getOneByName: jest.fn(),
            getAll: jest.fn(),
            updateUser: jest.fn(),
            deleteSelf: jest.fn(),
            deleteOne: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('getAll', () => {
    xit('should return an array of user info objects', async () => {
      const usersMock: UserInfo[] = [
        {
          id: 'mockId',
          emailAddress: 'mockEmail',
          username: 'mockUsername',
          isGraduated: true,
          token: 'mockToken',
          role: 'admin',
        },
        {
          id: 'mockId2',
          emailAddress: 'mockEmail2',
          username: 'mockUsername2',
          isGraduated: false,
          token: 'mockToken2',
          role: 'user',
        },
      ];

      const getAll = jest
        .spyOn(userService, 'getAll')
        .mockImplementation(async () => {
          return usersMock;
        });

      const users = await userController.getAll();

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty('id', 'id123');
    });
  });

  describe('getSelf', () => {
    xit('should return the user info for the authenticated user', async () => {
      const token = { id: '1', username: 'user1' };
      const user: UserInfo = {
        id: 'newId',
        emailAddress: 'newEmail',
        username: 'newUsername',
        isGraduated: false,
        token: 'newToken',
        role: 'owner',
      };
      jest.spyOn(userService, 'getOneByName').mockResolvedValue(user);

      const result = await userController.getSelf(token);

      expect(result).toBe(user);
    });
  });

  describe('getOne', () => {
    xit('should return the user info for the specified user ID', async () => {
      const user: UserInfo = {
        id: 'newId',
        emailAddress: 'newEmail',
        username: 'newUsername',
        isGraduated: false,
        token: 'newToken',
        role: 'user',
      };
      jest.spyOn(userService, 'getOne').mockResolvedValue(user);

      const result = await userController.getOne('1');

      expect(result).toBe(user);
    });
  });

  describe('updateUser', () => {
    xit('should update and return the user info for the specified user ID', async () => {
      const user: UserInfo = {
        id: 'newId',
        emailAddress: 'newEmail',
        username: 'newUsername',
        isGraduated: false,
        token: 'newToken',
        role: 'user',
      };
      jest.spyOn(userService, 'updateUser').mockResolvedValue(user);

      const result = await userController.updateUser('1', user);

      expect(result).toBe(user);
    });
  });

  describe('deleteSelf', () => {
    xit('should delete the authenticated user', async () => {
      const token = { id: '1', username: 'user1' };
      const deleteOneSpy = jest.spyOn(userService, 'deleteOne');

      await userController.deleteSelf(token);

      expect(deleteOneSpy).toHaveBeenCalledWith(token.id);
    });
  });

  describe('deleteUser', () => {
    xit('should delete the user with the specified ID', async () => {
      const deleteOneSpy = jest.spyOn(userService, 'deleteOne');

      await userController.deleteUser('1');

      expect(deleteOneSpy).toHaveBeenCalledWith('1');
    });
  });
});
