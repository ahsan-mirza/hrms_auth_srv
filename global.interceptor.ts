// global.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, catchError, throwError } from 'rxjs';
  
  @Injectable()
  export class GlobalInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((error) => {
          console.error('Global Interceptor Error:', error.message);
          return throwError(
            () =>
              new HttpException(
                {
                  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                  message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }),
      );
    }
  }
  