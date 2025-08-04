import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Method: ${req.method},\nRequestUrl: ${req.headers.host}${req.originalUrl}`
    );

    if (next) {
      next();
    }
  }
}
