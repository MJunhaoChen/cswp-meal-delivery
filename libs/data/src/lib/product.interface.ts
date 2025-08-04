import { Id } from './id.type';

export interface ProductInfo {
  id: Id;
  name: string | undefined;
  allergies: string[] | undefined;
  containsAlcohol: boolean | undefined;
}
