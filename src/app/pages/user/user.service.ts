import {Injectable} from "@angular/core";
import {User} from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  users: User[] = [
    {
      id: "12345-123-12",
      firstName: "Mark",
      lastName: "Maarten",
      emailAddress: "m.maarten@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-23",
      firstName: "Anita",
      lastName: "Agnes",
      emailAddress: "a.agnes@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-56",
      firstName: "Ewald",
      lastName: "Linde",
      emailAddress: "e.linde@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-13",
      firstName: "Judith",
      lastName: "Max",
      emailAddress: "j.max@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-14",
      firstName: "Noor",
      lastName: "Anoushka",
      emailAddress: "n.anoushka@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-15",
      firstName: "Miep",
      lastName: "Marga",
      emailAddress: "m.marga@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-16",
      firstName: "Jurriaan",
      lastName: "Hanne",
      emailAddress: "j.hanne@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
    {
      id: "12345-123-17",
      firstName: "Jenny",
      lastName: "Diana",
      emailAddress: "j.diana@avans.nl",
      birthDate: new Date(),
      isGraduated: false,
      phoneNumber: "0614442417",
    },
  ];

  constructor() {
    console.log("UserService created");
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    return this.users.filter((user: User) => user.id === id)[0];
  }

  addUser(newUser: User): void {
    this.users.push(newUser);
  }

  updateUser(updatedUser: User) {
    console.log("Updating user " + updatedUser.firstName);

    let updatedUsers = this.users.filter(
      (user) => user.id !== updatedUser.id
    );
    updatedUsers.push(updatedUser);
    this.users = updatedUsers;

    console.log(this.users);
  }
}
