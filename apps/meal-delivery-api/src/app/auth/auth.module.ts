import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schema/user.schema';
import { Identity, IdentitySchema } from '../schema/identity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identity.name, schema: IdentitySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
