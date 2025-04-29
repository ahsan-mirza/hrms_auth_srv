import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

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
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy], // ✅ Add JwtStrategy here
  exports: [UsersService],
})
export class UsersModule {}
