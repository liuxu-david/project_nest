import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { LogMiddleware } from './log.middleware';
import { TimeInterceptor } from './time.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PersonModule, UploadModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: 'person2',
    useFactory() {
        return {
            name: 'bbb',
            desc: 'cccc'
        }
    }
  }, {
    provide: APP_INTERCEPTOR,
    useClass: TimeInterceptor
  }],
})
export class AppModule implements NestModule{
  // 局部中间件使用方法
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('/api')
  }
}
