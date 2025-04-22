import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message:
        'Welcome Updated API',
      documentation: 'https://api-docs.example.com',
    };
  }
}
