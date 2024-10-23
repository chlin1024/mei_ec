import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MyLogger } from '../logger/logger';
import { Timestamp } from 'typeorm';

interface CustomRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    iat: Timestamp;
    exp: Timestamp;
  };
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new MyLogger();

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      //也有可能紀錄ip 避免惡意攻擊 duration優化時間使用
      const duration = Date.now() - start;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const userId = req.user?.id || 'unknown';
      const body = method !== 'GET' ? JSON.stringify(req.body) : '';

      this.logger.verbose(
        `[HTTP] ${statusCode} ${duration}ms ${method} ${originalUrl} USER_ID: ${userId} BODY: ${body}`, //USER_ID: "${userId}
      );
    });

    next();
  }
}
