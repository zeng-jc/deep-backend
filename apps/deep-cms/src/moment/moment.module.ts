import { Module } from '@nestjs/common';
import { MomentService } from './moment.service';
import { MomentController } from './moment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'),
        filename(req, file, callback) {
          const filename = new Date().getTime() + extname(file.originalname);
          return callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [MomentController],
  providers: [MomentService],
})
export class MomentModule {}
