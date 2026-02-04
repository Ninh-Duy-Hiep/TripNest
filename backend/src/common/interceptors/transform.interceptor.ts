import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const isObject =
          data !== null && typeof data === 'object' && !Array.isArray(data);

        const hasDataProperty = isObject && 'data' in data;
        const hasMetadataProperty = isObject && 'metadata' in data;

        const responseData = hasDataProperty
          ? (data as { data: T }).data
          : (data as T);

        const metadata = hasMetadataProperty
          ? (data as { metadata: unknown }).metadata
          : {};

        return {
          success: true,
          error: [],
          data: responseData,
          metadata: metadata,
        };
      }),
    );
  }
}
