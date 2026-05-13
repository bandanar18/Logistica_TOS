import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<any>();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any = exception instanceof HttpException 
      ? exception.getResponse() 
      : { message: 'Internal server error' };

    const requestId = request.headers['x-request-id'] || `REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const errorResponse = {
      success: false,
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse.message || 'An error occurred'),
      error: {
        code: exceptionResponse.error || 'INTERNAL_SERVER_ERROR',
        details: exceptionResponse.message instanceof Array ? exceptionResponse.message : [],
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    };

    response.status(status).json(errorResponse);
  }
}
