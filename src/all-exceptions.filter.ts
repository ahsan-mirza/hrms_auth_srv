import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        
            const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorMessage: any = 'Internal server error';
        let errorType: string | null = null;
        let errors: string[] = [];
        

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const res = exceptionResponse as any;

                console.log({res});
                

                if(res.message){
                    if(Array.isArray(res.message)){
                        errorMessage = res.message[0]
                    }else{
                        errorMessage = res.message;
                    }
                }else{
                    // take the first message if it's an array
                    errorMessage = Array.isArray(res) ? res[0] : 'Bad Request';
                }
                errorType = res.error || null;
                errors = Array.isArray(res.message) ? res.message : [res.message];
            } else {
                errorMessage = exceptionResponse;
                errors = [exceptionResponse];
            }
        }

        response.status(status).json({
            statusCode: status,
            success: false,
            path: request.url,
            timestamp: new Date().toISOString(),
            method: request.method,
            message: errorMessage,
            errorType: errorType || 'Error',
            errors,
            data: null,
        });
     
    }
}
