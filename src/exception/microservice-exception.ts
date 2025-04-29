import { RpcException } from '@nestjs/microservices';

interface ExceptionPayload {
  message: string;
  code: number;
  error?: string;
  details?: any;
}

export enum MicroserviceErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_ERROR = 500,
}

export class MicroserviceException extends RpcException {
  constructor(payload: ExceptionPayload) {
    super(payload);
  }

  // 🔹 400 Bad Request
  static BadRequest(message = 'Bad request', details?: any) {
    return new MicroserviceException({
      message,
      code: MicroserviceErrorCode.BAD_REQUEST,
      error: 'Bad Request',
      details,
    });
  }

  // 🔹 401 Unauthorized
  static Unauthorized(message = 'Unauthorized', details?: any) {
    return new MicroserviceException({
      message,
      code: 401,
      error: 'Unauthorized',
      details,
    });
  }

  // 🔹 403 Forbidden
  static Forbidden(message = 'Forbidden', details?: any) {
    return new MicroserviceException({
      message,
      code: 403,
      error: 'Forbidden',
      details,
    });
  }

  // 🔹 404 Not Found
  static NotFound(message = 'Not found', details?: any) {
    return new MicroserviceException({
      message,
      code: 404,
      error: 'Not Found',
      details,
    });
  }

  // 🔹 409 Conflict
  static Conflict(message = 'Conflict', details?: any) {
    return new MicroserviceException({
      message,
      code: 409,
      error: 'Conflict',
      details,
    });
  }

  // 🔹 422 Unprocessable Entity
  static UnprocessableEntity(message = 'Unprocessable Entity', details?: any) {
    return new MicroserviceException({
      message,
      code: 422,
      error: 'Unprocessable Entity',
      details,
    });
  }

  // 🔹 500 Internal Server Error
  static InternalError(message = 'Internal server error', details?: any) {
    return new MicroserviceException({
      message,
      code: 500,
      error: 'Internal Server Error',
      details,
    });
  }

  // 🔹 Custom Error
  static Custom(message: string, code: number, error = 'Error', details?: any) {
    return new MicroserviceException({
      message,
      code,
      error,
      details,
    });
  }
}
