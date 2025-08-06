import { Id } from './id.type';
import { UserInfo } from './user.interface';

export interface MealInfo {
  id: Id;
  name: string;
  price: number | undefined;
  deliveryTime: Date | undefined;
  deliveryDate: Date | undefined;
  owner: UserInfo | undefined;
  studentHouseId: string | undefined;
}
