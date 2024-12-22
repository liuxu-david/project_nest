import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from "fs";
import * as crypto from 'crypto'

@Injectable()
export class UploadService {
  handleVerify(info){
    const dirPath = path.resolve('FilesList',info.fileHash)
    console.log(dirPath);
    // 判断当前分片是否存在
    try {
      const hasCurDir = fs.readdirSync(dirPath);
      // 如果存在则读取返回给前端（用于前端妙传）
      return hasCurDir.filter(item=>item.endsWith('.part')).map(item=>parseInt(item.split('.')[0],10))
    } catch (error) {
      // 不存在则返回空数组
      return []
    }
    
  }
  handleUploadFile(id,fileHash,file){
    // 1.处理文件放入临时文件夹
    const targetDir = path.resolve('FilesList',fileHash) 
    // 2.判断该hash是否存在
    if(!fs.existsSync(targetDir)){
      // 3.不存在则创建该文件夹
      fs.mkdirSync(targetDir,{recursive:true})
    }
    // 4.校验接口已经过滤了已存在的分片，所以这里不用判断是否已存在分片
    // 5.写入分片
    const chunkFilePath = path.resolve(targetDir,`${id}.part`)
    // 6.将临时分片移到目标目录下
    fs.renameSync(file.path,chunkFilePath)
  }

  async handleMergeFile(fileHash,totalNum,name){
   try {
    const dirPath = path.resolve('FilesList',fileHash)
    const allFileInfo = fs.readdirSync(dirPath).filter(item=>item.endsWith('.part')).sort((a,b)=>{
      const chartA = parseInt(path.basename(a).split('.')[0],10);
      const chartB = parseInt(path.basename(b).split('.')[0],10);
      return chartA -chartB
    });
    
    if(totalNum!==allFileInfo.length){
      // 返回分片缺失，需要重新上传
    }
    // 开始执行合并
    const outPath = path.resolve('FilesList',fileHash,name)
    const writeStream = fs.createWriteStream(outPath)
    for(let i = 0;i<allFileInfo.length;i++){
      const readPath = path.resolve(dirPath,allFileInfo[i])
      const chunkData = fs.readFileSync(readPath);
      writeStream.write(chunkData)
    }
    await writeStream.end()
    // hash校验
    console.log("outPath",outPath);
    const fileMd5 = await this.handleMd5File(outPath)
    console.log("fileMd5",fileMd5);
    
    if(fileMd5 === fileHash){
      // console.log("上传obs");
      // 上传OBS(这里不做上传了,直接在前端使用完美oss上传方案)
       // 删除临时文件
      await this.handleDeleteFile(dirPath)
    }
    return []
   } catch (error) {
    console.log("merge",error);
    
   }
  }

  // 读取文件夹下的文件，然后进行md5处理
  handleMd5File(path){
    return new Promise((resolve,reject)=>{
      const hash = crypto.createHash('md5');
      const fileStream = fs.createReadStream(path);
      fileStream.on('data', (chunk) => {
        console.log(chunk);
        hash.update(chunk);
      });
      fileStream.on('end', () => {
        const fileMd5 = hash.digest('hex');
        fileStream.close()
        resolve(fileMd5)
      });
      fileStream.on('error', (err) => {
        console.error(`File read error: ${err}`);
        reject(err);
      });
    })
  }
  handleDeleteFile(dirPath){
    return new Promise((resolve, reject) => {
      fs.rm(dirPath, { recursive: true, force: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('临时文件删除成功');
        }
      });
    })
  }
}
