import { Test, TestingModule } from '@nestjs/testing';
import { MealService } from './meal.service';
import { InjectToken } from '../auth/token.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MealService', () => {
  let app: TestingModule;
  let mealService: MealService;

  const mockInjectToken = { id: 'mockTokenId' };
  const mockUser = {
    id: '1',
    username: 'mario',
    emailAddress: 'mario@mario.nl',
    isGraduated: false,
    token: '123',
    role: 'student',
  };

  const mockUser2 = {
    id: '2',
    username: 'mario2',
    emailAddress: 'mario2@mario.nl',
    isGraduated: false,
    token: '1234',
    role: 'student',
  };

  const mockMeal = {
    id: '1',
    name: 'Test Meal',
    price: 10,
    deliveryTime: new Date(),
    deliveryDate: new Date(),
    owner: mockUser,
    studentHouseId: '123',
  };

  const mockMeal2 = {
    id: '2',
    name: 'Test Meal2',
    price: 10,
    deliveryTime: new Date(),
    deliveryDate: new Date(),
    owner: mockUser2,
    studentHouseId: '123',
  };

  const mockCreateMeal = jest.fn();
  const mockGetAll = jest.fn();
  const mockGetOne = jest.fn();
  const mockUpdateMeal = jest.fn();
  const mockDeleteOne = jest.fn();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        MealService,
        {
          provide: InjectToken,
          useValue: mockInjectToken,
        },
      ],
    })
      .overrideProvider(MealService)
      .useValue({
        createMeal: mockCreateMeal,
        getAll: mockGetAll,
        getOne: mockGetOne,
        updateMeal: mockUpdateMeal,
        deleteOne: mockDeleteOne,
      })
      .compile();

    mealService = app.get<MealService>(MealService);
  });

  describe('createMeal', () => {
    it('should call createMeal with correct parameters', async () => {
      await mealService.createMeal(mockMeal, mockInjectToken.id);

      expect(mockCreateMeal).toHaveBeenCalledWith(mockMeal, mockInjectToken.id);
    });
  });

  describe('getAll', () => {
    it('should return an array of MealInfo objects', async () => {
      const mockMeals = [mockMeal, mockMeal2];

      jest.spyOn(mealService, 'getAll').mockReturnValue(mockMeals as any);

      const result = await mealService.getAll();

      expect(result).toEqual(mockMeals);
    });
  });

  describe('getOne', () => {
    it('should return the correct MealInfo object', async () => {
      jest.spyOn(mealService, 'getOne').mockReturnValue(mockMeal as any);

      const result = await mealService.getOne('1');

      expect(result).toEqual(mockMeal);
    });
  });

  describe('updateMeal', () => {
    const mockOwnerId = '1234';
    const mockUpdatedMeal = {
      id: '1',
      name: 'Updated Meal',
      price: 20,
      deliveryTime: new Date(),
      deliveryDate: new Date(),
      owner: mockUser,
      studentHouseId: '123',
    };

    it('should update a meal with correct parameters and return the updated meal', async () => {
      jest
        .spyOn(mealService, 'updateMeal')
        .mockReturnValue(mockUpdatedMeal as any);

      const result = await mealService.updateMeal(
        '1',
        mockUpdatedMeal,
        mockOwnerId
      );

      expect(result).toEqual(mockUpdatedMeal);
    });

    it('should throw an error when the owner id does not match the meal owner id', async () => {
      jest
        .spyOn(mealService, 'updateMeal')
        .mockReturnValue(mockUpdatedMeal as any);

      try {
        await mealService.updateMeal('1', mockUpdatedMeal, '123');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty('status', HttpStatus.UNAUTHORIZED);
        expect(error).toHaveProperty(
          'response',
          'You are not authorized to update this meal'
        );
      }
    });

    it('should throw an error when the meal does not exist', async () => {
      jest
        .spyOn(mealService, 'updateMeal')
        .mockReturnValue(mockUpdatedMeal as any);

      try {
        await mealService.updateMeal('2', mockUpdatedMeal, mockOwnerId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
        expect(error).toHaveProperty(
          'response',
          'Meal with id 2 does not exist'
        );
      }
    });
  });

  describe('deleteOne', () => {
    it('should call deleteOne with correct parameters', async () => {
      await mealService.deleteOne('1', '1');

      expect(mockDeleteOne).toHaveBeenCalledWith('1', '1');
    });
  });
});
