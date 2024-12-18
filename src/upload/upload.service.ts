import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from "fs";

@Injectable()
export class UploadService {
  handleVerify(info){
    const dirPath = path.resolve('FilesList',info.fileHash)
    console.log(dirPath);
    // 判断当前分片是否存在
    try {
      const hasCurDir = fs.readdirSync(dirPath);
      // 如果存在则读取返回给前端（用于前端妙传）
      console.log(hasCurDir);
      return hasCurDir
    } catch (error) {
      // 不存在则返回空数组
      return []
    }
    
  }
}
