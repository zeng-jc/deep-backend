import { Injectable } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  private readonly baseBucket = 'deep-resource';
  constructor(private readonly minio: MinioService) {}
  get client(): MinioClient {
    return this.minio.client;
  }
  async upload(
    file: Express.Multer.File,
    baseBucket: string = this.baseBucket,
  ) {
    const metaData = { 'Content-Type': file.mimetype };
    try {
      await this.client.putObject(baseBucket, file.originalname, file.buffer, metaData);
      return '上传成功';
    } catch (error) {}
  }

  async deleteFile(objetName: string, baseBucket: string = this.baseBucket) {
    const tmp: any = await this.listAllFilesByBucket();
    const names = tmp?.map((i) => i.name);
    if (!names.includes(objetName)) {
      return '删除失败，文件不存在';
    }
    return this.client.removeObject(baseBucket, objetName, async (err) => {
      if (err) {
        return '删除失败，请重试';
      }
    });
  }

  async download(fileName) {
    return await this.client.getObject(this.baseBucket, fileName);
  }

  async listAllFilesByBucket() {
    const tmpByBucket = await this.client.listObjectsV2(
      this.baseBucket,
      '',
      true,
    );
    return this.readData(tmpByBucket);
  }

  readData = async (stream) =>
    new Promise((resolve, reject) => {
      const a = [];
      stream
        .on('data', function (row) {
          a.push(row);
        })
        .on('end', function () {
          resolve(a);
        })
        .on('error', function (error) {
          reject(error);
        });
    });

  async getImageUrl(filename: string) {
    const presignedUrl = await this.client.presignedGetObject(
      'deep-resource',
      filename,
    );
    return presignedUrl;
  }
}
