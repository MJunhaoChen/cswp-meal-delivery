import { Test, TestingModule } from '@nestjs/testing';
import { OrderListService } from './orderlist.service';
import { InjectToken } from '../auth/token.decorator';

describe('OrderListService', () => {
  let app: TestingModule;
  let service: OrderListService;

  const mockInjectToken = { id: 'mockTokenId' };
  const mockOrderList = { id: 'mockOrderId' };

  const mockAddMealToUser = jest.fn();
  const mockRemoveMealFromUser = jest.fn();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        OrderListService,
        {
          provide: InjectToken,
          useValue: mockInjectToken,
        },
      ],
    })
      .overrideProvider(OrderListService)
      .useValue({
        addMealToUser: mockAddMealToUser,
        removeMealFromUser: mockRemoveMealFromUser,
      })
      .compile();

    service = app.get<OrderListService>(OrderListService);
  });

  describe('addMealToUser', () => {
    it('should call addMealToUser with correct parameters', async () => {
      await service.addMealToUser(mockOrderList.id, mockInjectToken.id);

      expect(mockAddMealToUser).toHaveBeenCalledWith(
        mockOrderList.id,
        mockInjectToken.id
      );
    });
  });

  describe('removeMealFromUser', () => {
    it('should call removeMealFromUser with correct parameters', async () => {
      await service.removeMealFromUser(mockOrderList.id, mockInjectToken.id);

      expect(mockRemoveMealFromUser).toHaveBeenCalledWith(
        mockOrderList.id,
        mockInjectToken.id
      );
    });
  });
});
