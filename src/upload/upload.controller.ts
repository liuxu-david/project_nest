import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { fileVerifyDto } from './dto/verify-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/verify')
  verify(@Body() verifyInfo: fileVerifyDto) {
    this.uploadService.handleVerify(verifyInfo)
    return 'Hello';
  }

  @Post()
  @UseInterceptors(FileInterceptor('file',{dest:'FilesList'}))
  uploadFile(@UploadedFile() file:Express.Multer.File){

  }
}
