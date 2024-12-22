import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Inject
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { fileVerifyDto } from './dto/verify-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { infoDto } from './dto/upload.dto';
import { fileMergeDto } from './dto/merge-upload.dto';
import { OssService } from '../oss/oss.service';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Inject() private readonly ossService:OssService

  @Post('/verify')
  verify(@Body() verifyInfo: fileVerifyDto) {
    const res = this.uploadService.handleVerify(verifyInfo)
    return res;
  }

  @Post()
  @UseInterceptors(FileInterceptor('chunkfile',{dest:'FilesList'}))
  uploadFile(@UploadedFile() file:Express.Multer.File,@Body() info:infoDto){
    const {id,fileHash} = info
    this.uploadService.handleUploadFile(id,fileHash,file)
  }

  @Post('/merge')
  mergeFile(@Body() info:fileMergeDto){
    const {fileHash,totalChunksNum,name} = info
    this.uploadService.handleMergeFile(fileHash,totalChunksNum,name)
  }
  @Get('/image')
  async handleSignature(){
    return await this.ossService.getSignature()
  }
}
