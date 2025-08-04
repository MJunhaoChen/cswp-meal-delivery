import { Id } from './id.type';

export interface UserIdentity {
  id: Id;
  username: string;
}

export interface UserInfo extends UserIdentity {
  emailAddress: string;
  isGraduated: boolean;
  token: string;
  role: string;
}

export interface IToken {
  id: Id;
  emailAddress: string;
  username: string;
  role: string;
  token: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  emailAddress: string;
  isGraduated: boolean;
  role: string;
}
