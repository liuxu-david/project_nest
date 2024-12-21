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

  handleMergeFile(fileHash,totalNum,name){
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
    writeStream.end()
    // hash校验
    // 上传OBS
    // 删除临时文件
  }
}
