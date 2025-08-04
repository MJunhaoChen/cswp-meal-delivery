import { UserRole } from './roles';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  emailAddress: string;
  isGraduated: boolean;
  role: UserRole;
}

export interface Token {
  token: string;
}
