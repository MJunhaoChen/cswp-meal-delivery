export enum Gender {
  male = 'male',
  female = 'female',
  unknown = 'unknown',
  other = 'other',
}

export class User {
  id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  emailAddress: string | undefined;
  birthDate: Date | undefined;
  gender: Gender = Gender.unknown;

  constructor(id: string, firstName: string) {
    this.id = id;
    // Verder aanvullen
  }
}
