import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessages: any[] = [];
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (
        typeof res === 'object' &&
        res !== null &&
        'message' in (res as Record<string, unknown>)
      ) {
        const msg = (res as { message: unknown }).message;
        errorMessages = Array.isArray(msg) ? msg : [String(msg)];
      } else if (typeof res === 'string') {
        errorMessages = [res];
      } else {
        errorMessages = [JSON.stringify(res)];
      }
    } else {
      errorMessages = ['Internal Server Error'];
      console.error(exception);
    }

    const responseBody: ApiResponse<any> = {
      success: false,
      error: errorMessages,
      data: {},
      metadata: {},
    };

    response.status(status).json(responseBody);
  }
}
