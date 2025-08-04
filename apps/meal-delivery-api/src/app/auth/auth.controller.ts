import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { LocalStorage, UserCredentials, UserRegistration } from '@md/data';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() credentials: UserRegistration): Promise<LocalStorage> {
    try {
      await this.authService.registerUser(credentials);

      return {
        id: await this.authService.createUser(
          credentials.username,
          credentials.emailAddress,
          credentials.isGraduated,
          credentials.role
        ),
        token: await this.authService.generateToken(
          credentials.username,
          credentials.password
        ),
      };
    } catch (e) {
      let errorMessage = 'Failed to do something exceptional';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.log('Register error: ' + errorMessage);
      throw new HttpException(
        'Gebruikersnaam of e-mailadres ongeldig omdat gebruiker al bestaat.',
        HttpStatus.CONFLICT
      );
    }
  }

  @Post('login')
  async login(@Body() userCredentials: UserCredentials): Promise<LocalStorage> {
    try {
      const userId = await this.authService.getId(userCredentials.username);
      const token = await this.authService.generateToken(
        userCredentials.username,
        userCredentials.password
      );
      return {
        id: userId.toString(),
        token,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Het ingevoerde wachtwoord is onjuist voor gebruikersnaam ${username}.';
      console.log(`Login error: ${errorMessage}`);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
  }
}
