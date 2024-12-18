import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // 构造器注入
  constructor() {}
  getHello(): string {
    return `Hello World!`;
  }
}
