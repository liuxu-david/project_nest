import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OSS from "ali-oss";

@Injectable()
export class OssService {
  @Inject('ALI_OSS_CLIENT') private readonly aliOssClient:OSS
  @Inject() private readonly configService:ConfigService

  async getSignature(){
    const date = new Date();
    // 设置签名的有效期，单位为秒。
    date.setSeconds(date.getSeconds() + 3600);
    const policy = {
      expiration: date.toISOString(),
      conditions: [
        // 设置上传文件的大小限制。
        ["content-length-range", 0, 1048576000],
        // 限制可上传的Bucket。
        { bucket: this.aliOssClient.options.bucket },
      ],
    };
    const formData = await this.aliOssClient.calculatePostSignature(policy);
    const location = await this.aliOssClient.getBucketLocation();
    const oss_setting = this.configService.get('oss_setting')
    const host = `http://${oss_setting.bucket}.${location.location}.aliyuncs.com`;
    // 指定上传到OSS的文件前缀。
    const dir = new Date().toLocaleDateString();
    return {
      policy: formData.policy,
      signature: formData.Signature,
      ossAccessKeyId: formData.OSSAccessKeyId,
      host,
      dir
    };
  }
}
