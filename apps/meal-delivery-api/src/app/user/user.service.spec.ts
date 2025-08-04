import { Test, TestingModule } from '@nestjs/testing';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { UserService } from './user.service';
import { Identity, IdentityDocument } from '../schema/identity.schema';
import { User, UserDocument } from '../schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';
import { UserInfo } from '@md/data';
import { Neo4jService } from '../neo4j/neo4j.service';

describe('UserService', () => {
  let userService: UserService;
  let neo4jService: Neo4jService;
  let identityModel: Model<IdentityDocument>;
  let userModel: Model<UserDocument>;

  const mockUser = {
    id: 'mockId',
    emailAddress: 'mockEmail',
    username: 'mockUser',
    isGraduated: true,
    role: 'admin',
  };

  const mockUserInfo: UserInfo = {
    id: 'newId',
    emailAddress: 'newEmail',
    username: 'newUsername',
    isGraduated: false,
    token: 'newToken',
    role: 'user',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: Neo4jService,
          useValue: {
            singleWrite: jest.fn(),
          },
        },
        {
          provide: getModelToken(Identity.name),
          useValue: {
            deleteOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            getAll: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    neo4jService = app.get<Neo4jService>(Neo4jService);
    identityModel = app.get<Model<IdentityDocument>>(
      getModelToken(Identity.name)
    );
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  });

  describe('getAll', () => {
    // it('executes correct cypher query in the neo4j service', async () => {
    // const singleWrite = jest
    // .spyOn(neo4jService, 'singleWrite')
    // .mockImplementation((q, p) => undefined);
    // });

    xit('should return all users', async () => {
      const expectedResult = [mockUser];
      jest
        .spyOn(userModel, 'find')
        .mockResolvedValueOnce(expectedResult as UserDocument[]);

      const result = await userService.getAll();

      expect(result).toEqual(expectedResult);
      expect(userModel.find).toHaveBeenCalledWith({}, { _id: 0, __v: 0 });
    });
  });

  describe('getOneByName', () => {
    it('should return a user with the given username', async () => {
      const expectedResult = mockUser;
      jest.spyOn(userModel, 'aggregate').mockResolvedValueOnce([mockUser]);

      const result = await userService.getOneByName(mockUser.username);

      expect(result).toEqual(expectedResult);
      expect(userModel.aggregate).toHaveBeenCalledWith([
        { $match: { username: mockUser.username } },
      ]);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce(mockUser as UserDocument);
      jest
        .spyOn(userModel, 'updateOne')
        .mockResolvedValueOnce({} as UpdateWriteOpResult);

      const result = await userService.updateUser(mockUser.id, mockUserInfo);

      expect(result).toEqual(mockUserInfo);
      expect(userModel.findOne).toHaveBeenCalledWith({ id: mockUser.id });
      expect(userModel.updateOne).toHaveBeenCalledWith({ id: mockUser.id }, [
        {
          $set: {
            id: mockUser.id,
            emailAddress: mockUserInfo.emailAddress,
            username: mockUserInfo.username,
            isGraduated: mockUserInfo.isGraduated,
            role: mockUserInfo.role,
          },
        },
      ]);
    });

    it('should throw an HttpException if the user does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      await expect(
        userService.updateUser(mockUser.id, mockUserInfo)
      ).rejects.toThrowError(HttpException);
      expect(userModel.findOne).toHaveBeenCalledWith({ id: mockUser.id });
      expect(userModel.updateOne).not.toHaveBeenCalled();
    });

    it('should throw an HttpException if an error occurs during update', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce(mockUser as UserDocument);
      jest
        .spyOn(userModel, 'updateOne')
        .mockRejectedValueOnce(new Error('Something went wrong'));

      await expect(
        userService.updateUser(mockUser.id, mockUserInfo)
      ).rejects.toThrowError(HttpException);
      expect(userModel.findOne).toHaveBeenCalledWith({ id: mockUser.id });
      expect(userModel.updateOne).toHaveBeenCalledWith({ id: mockUser.id }, [
        {
          $set: {
            id: mockUser.id,
            emailAddress: mockUserInfo.emailAddress,
            username: mockUserInfo.username,
            isGraduated: mockUserInfo.isGraduated,
            role: mockUserInfo.role,
          },
        },
      ]);
    });
  });

  describe('deleteOne', () => {
    it('should throw an error if deleting identity fails', async () => {
      jest.spyOn(userService, 'getOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(identityModel, 'deleteOne')
        .mockRejectedValueOnce(new Error('Identity deletion failed'));

      expect(userModel.deleteOne).not.toHaveBeenCalled();
    });
  });
});
