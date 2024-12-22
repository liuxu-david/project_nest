const devConfig = {
  oss_setting:{
      // 配置环境变量ID。
      // 配置环境变量SECRET。
      // 将<YOUR-BUCKET>替换为Bucket名称。
      bucket: 'liuxu-david',
      // 指定上传到OSS的文件前缀。
      dir: "image/",
  }
}

export default () => devConfig