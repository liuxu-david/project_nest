import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('before 路由中间件');
    next();
    console.log('after 路由中间件');
    
  }
}
