import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/users/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.USER_LOGIN_SECRET,
        signOptions: {
          expiresIn: '1h', // optional: specify expiration
        },
      }),
    }),
    DatabaseModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ✅ Add JwtStrategy here
})
export class AuthModule {}
