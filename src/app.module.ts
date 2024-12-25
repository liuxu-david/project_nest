import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './modules/upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OssModule } from './modules/oss/oss.module';
import config from './config/index';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import isDev from './utils/inDev';

@Module({
  imports: [...setupModules(), UploadModule, OssModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// 添加初始化模块配置
function setupModules() {
  // 集成配置文件
  const _configModule = ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  });

  // 集成日志框架nest-winston
  const _loggerModule = WinstonModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      //levels = {error: 0,warn: 1,info: 2,http: 3,verbose: 4,debug: 5,silly: 6};
      const proTransportsList = [
        new transports.DailyRotateFile({
          level: 'error', //只记录error的日志
          dirname: 'logs', //保存的文件夹
          datePattern: 'YYYY-MM-DD', //日期格式化形式
          filename: '%DATE%-error.log', //文件以日期命名
          maxSize: '20m', //最大一个日志文件20M
          maxFiles: '30d', //最多保存30天
          //为每条日志加上时间戳，并格式化为json格式
          format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.DailyRotateFile({
          level: 'info', //这个文件只记录info严重以上的日志
          dirname: 'logs', //保存的文件夹
          datePattern: 'YYYY-MM-DD', //日期格式化形式
          filename: '%DATE%-combined.log', //文件以日期命名，这里存放联合的日志
          maxSize: '20m', //最大一个日志文件20M
          maxFiles: '10d', //最多保存30天
          format: format.combine(
            format((info) => {
              //这里可以过滤掉失败的日志，因为有一个文件已经专门记录错误日志
              if (info.level === 'error') {
                return false;
              }
              return info;
            })(),
            format.timestamp(),
            format.json(),
          ),
        }),
      ];
      // 开发环境直接打印在控制台
      const devTransportsList = [
        new transports.Console({
          level:'debug',
          format: format.combine(
            format.colorize(),
            format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
            format.printf((info=> {
              return `${info.timestamp} [${info?.context || '未传context参数'}] [${info.level}]: ${info.message}`
            }))
          )
        })
      ];

      const transportsList = isDev() ? devTransportsList : proTransportsList;
      return { transports: transportsList };
    },
  });

  return [_configModule, _loggerModule];
}
