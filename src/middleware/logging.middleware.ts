// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
//import { MyLogger } from 'src/logger/logger';

// @Injectable()
// export class LoggingMiddleware implements NestMiddleware {
//   private readonly logger = new MyLogger();

//   use(req: Request, res: Response, next: NextFunction) {
//     const start = Date.now();

//     res.on('finish', () => {
//       const duration = Date.now() - start;
//       const { method, originalUrl } = req;
//       const { statusCode } = res;
//       //const userId = req.user?.id || 'unknown'; // Assuming user is added to request
//       const body = method !== 'GET' ? JSON.stringify(req.body) : '';

//       this.logger.verbose(
//         `[HTTP] ${statusCode} ${duration}ms ${method} ${originalUrl} BODY: ${body}`, //USER_ID: "${userId}
//       );
//     });

//     next();
//   }
// }
