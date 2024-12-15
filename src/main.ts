import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request,Response,NextFunction} from 'express'
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public',{prefix:'/static'})
  // 不传入任何配置，允许所有跨域
  app.enableCors()

  // 统一设置路由前缀
  app.setGlobalPrefix('/api')

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
  const port = process.env.PORT ?? 5000
  await app.listen(port);
  console.log(`运行在${port}`);
  
}
bootstrap();
