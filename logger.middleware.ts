import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(`Request...`);
    // // fetch bearer token
    // const token = req.headers.authorization?.split(' ')[1];
    // if (token) {
    //   console.log(`Bearer Token: ${token}`);
    // }
    // console.log(`Method: ${req.method}`);
    next();
  }
}
