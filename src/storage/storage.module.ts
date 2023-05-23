import * as mime from 'mime';
import * as Jimp from 'jimp';
import { v2 as cloudinary } from 'cloudinary';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { CLOUDINARY, JIMP, MIME } from './storage.constants';

@Module({
  providers: [
    {
      provide: JIMP,
      useValue: Jimp,
    },
    {
      provide: MIME,
      useValue: mime,
    },
    {
      provide: CLOUDINARY,
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('cloudName'),
          api_key: configService.get<string>('cloudApiKey'),
          api_secret: configService.get<string>('cloudApiSecret'),
          secure: true,
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
