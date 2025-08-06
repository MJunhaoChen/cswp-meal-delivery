import { Id } from './id.type';

export interface StudentHouseInfo {
  id: Id;
  streetAndNmr: string | undefined;
  city: string | undefined;
  postcode: string | undefined;
}
