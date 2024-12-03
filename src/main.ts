import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request,Response,NextFunction} from 'express'
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public',{prefix:'/static'})

  // 全局中间件
  // app.use(function(req:Request,res:Response,next:NextFunction){
  //   console.log("before 全局中间件");
  //   next()
  //   console.log("after 全局中间件");
  // })

  // 全局路由守卫
  // app.useGlobalGuards(new LoginGuard())

  // 全局拦截器
  // app.useGlobalInterceptors(new TimeInterceptor())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
