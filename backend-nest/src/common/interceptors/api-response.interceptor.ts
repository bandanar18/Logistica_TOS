import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] || `REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: data?.message || 'Operation completed successfully',
        data: data?.data !== undefined ? data.data : data,
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      })),
    );
  }
}
