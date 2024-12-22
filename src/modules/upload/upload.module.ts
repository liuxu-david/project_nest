import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { OssModule } from '../oss/oss.module';

@Module({
  imports: [OssModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
