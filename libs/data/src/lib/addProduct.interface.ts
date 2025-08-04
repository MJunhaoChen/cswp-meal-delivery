import { Id } from './id.type';

export interface AddProductIds {
  productId: string[];
  mealId: Id;
}

export interface RemoveProductIds {
  productIds: string[];
}
