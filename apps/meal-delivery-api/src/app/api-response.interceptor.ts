import { ApiResponse } from '@md/data';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((results) => {
        if (results) {
          return {
            results,
            info: {
              type: results instanceof Array ? 'list' : 'object',
              count: results instanceof Array ? results.length : 1,
            },
          };
        } else {
          return {
            results: 'Operation successful or no results available.',
            info: {
              type: 'none',
              count: 0,
            },
          };
        }
      })
    );
  }
}
