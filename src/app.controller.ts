import { Controller, Get, Query, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';
import { ValidatePipe } from './validate.pipe';

@Controller()
// @UseGuards(LoginGuard) 局部路由守卫
// @UseInterceptors(TimeInterceptor) 局部拦截器
// @UsePipes(ValidatePipe) 管道
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
      return this.appService.getHello();
  }
  // 局部使用管道
  @Get('/api/a')
  getHello1(@Query('num', ValidatePipe)num: number): number {
    return num+1
      // return this.appService.getHello();
  }
  @Get('api/b')
  getHello2(): string {
      return this.appService.getHello();
  }
  @Get('c')
  getHello3(): string {
      return this.appService.getHello();
  }
}
