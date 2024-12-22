import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './modules/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import config from "./config/index";

@Module({
  imports: [...setupModules(), UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}


// 添加初始化模块配置
function setupModules() {
  const _config = ConfigModule.forRoot({
    isGlobal:true,
    load: [config]
  })
  console.log(config.name);
  return [_config]
}