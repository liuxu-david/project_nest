import { Global, Module } from '@nestjs/common';
import { OssService } from './oss.service';
import { ConfigService } from '@nestjs/config';
import * as OSS from "ali-oss";

@Module({
  providers: [OssService,
    {
    provide: 'ALI_OSS_CLIENT',
    useFactory(configService:ConfigService) {
      const client = new OSS(configService.get('oss_setting'));
      return client
    },
    inject: [ConfigService]
  }
],
  exports:[OssService]
})
export class OssModule {}
