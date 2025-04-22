import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserDevicesService } from './user-device.services';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
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
  providers: [UsersService, JwtStrategy, UserDevicesService], // ✅ Add JwtStrategy here
  exports: [UsersService, UserDevicesService],
})
export class UsersModule {}
