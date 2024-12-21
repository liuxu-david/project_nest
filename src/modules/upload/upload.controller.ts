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
import { infoDto } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/verify')
  verify(@Body() verifyInfo: fileVerifyDto) {
    this.uploadService.handleVerify(verifyInfo)
    return 'Hello';
  }

  @Post()
  @UseInterceptors(FileInterceptor('chunkfile',{dest:'FilesList'}))
  uploadFile(@UploadedFile() file:Express.Multer.File,@Body() info:infoDto){
    const {id,fileHash} = info
    this.uploadService.handleUploadFile(id,fileHash,file)
  }
}
