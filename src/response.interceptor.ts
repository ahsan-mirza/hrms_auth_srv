import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();


    

    return next.handle().pipe(
      map((data) => {
        const hasMessage = data && typeof data === 'object' && 'message' in data;
        const message = hasMessage ? data.message : 'Success';
        if (hasMessage) {
          delete data.message;
        }
        return {
          statusCode: response.statusCode,
          path: ctx.getRequest().url,
          timestamp: new Date().toISOString(),
          success: true,
          method: ctx.getRequest().method,
          message: message,
          //   error: null,
          //   errors: [],
          data,
        }
      }),
    );
  }
}
