import { User } from '../user/user.model';

export class Meal {
  id: string | undefined;
  name: string | undefined;
  price: number | undefined;
  deliveryTime: Date | undefined;
  deliveryDate: Date | undefined;
  owner: string | undefined;
  ownerRef: User | undefined;
  studentHouseId: string | undefined;
  user?: User | undefined;
}

export class AddProductIds {
  productId: string[] | undefined;
  mealId: string | undefined;
}

export class RemoveProductIds {
  productIds: string[] | undefined;
}
