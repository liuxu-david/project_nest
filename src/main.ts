import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public',{prefix:'/static'})
  // 不传入任何配置，允许所有跨域
  app.enableCors()
  // 统一设置路由前缀
  app.setGlobalPrefix('/api')
  // 全局使用响应拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  const port = process.env.PORT ?? 5000
  await app.listen(port);
  console.log(`运行在${port}`);
  
}
bootstrap();
