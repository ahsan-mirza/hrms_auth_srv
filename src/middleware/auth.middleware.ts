import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token is not provided');
      return next(); // Allow access but without authentication
    }

    const token = authHeader.split(' ');

    console.log('Decoded token:', token);

    try {
      const decoded = jwt.decode(token) as {
        userId: string;
        exp: number;
      } | null;
      console.log('Decoded token:', decoded);

      if (!decoded || !decoded.userId) {
        console.log('Invalid token');
        return next();
      }

      if (decoded.exp * 1000 < Date.now()) {
        console.log('Token is expired');
        return next();
      }

      req.user = { userId: decoded.userId } as any; // Extend user object as needed
      console.log('User is authenticated', req.user);
    } catch (error) {
      console.log('Error decoding token', error);
      throw new UnauthorizedException('Invalid token.');
    }

    next();
  }
}
