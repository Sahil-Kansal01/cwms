import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/database/users.entity';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_JWT,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_IN }
    }),
    TypeOrmModule.forFeature([Users])
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController]
})
export class AuthModule { }
