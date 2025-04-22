import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users.service';
import { User } from '../entities/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor() {
    console.log('JwtStrategy initialized ✅');
    console.log(process.env.USER_LOGIN_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.USER_LOGIN_SECRET || 'secertOrkey', // Make sure this is correct
    });
  }

  async validate(payload: any) {
    console.log({ payload });
    console.log(process.env.USER_LOGIN_SECRET);
    try {
      // Use the sequelize instance to query the User model
      const user = await User.findOne({
        where: { id: payload.id },
        attributes: ['id', 'email', 'username', 'firstName', 'lastName'],
        raw: true,
      });

      console.log({ user });

      if (!user) {
        throw new UnauthorizedException('Invalid token or user not found');
      }

      return user; // This will be added to the request object as `req.user`
    } catch (error) {
      console.error('Error in JWT validation:', error);
      throw new UnauthorizedException('Invalid token or user not found');
    }
  }
}
