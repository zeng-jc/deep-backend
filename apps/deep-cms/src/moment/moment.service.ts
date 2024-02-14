import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentEntity, MomentLabelEntity } from '@app/deep-orm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { Like } from 'typeorm';
import { DeepMinioService } from '@app/deep-minio';
import { extname } from 'path';
import { CmsErrorCode, CmsErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
const bucketName = 'deep-moment';
@Injectable()
export class MomentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  async create(files: Express.Multer.File[], createMomentDto: CreateMomentDto, type: string) {
    const user = await this.database.userRepo.findOne({
      where: {
        id: Number(createMomentDto.userId) || 0,
      },
    });
    const moment = new MomentEntity();

    if (files.length) {
      const filenames = [...files.map((item) => (item.originalname = new Date().getTime() + extname(item.originalname)))];
      // 存储到minio
      await this.deepMinioService.uploadFiles(files, bucketName);
      if (type === 'images') moment.images = filenames;
      if (type === 'video') moment.video = filenames;
    }
    moment.content = createMomentDto.content;
    moment.user = user;
    // 1. 获取lable的id
    const momentLableIds = await Promise.all(
      createMomentDto.labels?.map(async (tag) => {
        const momentLabelExisting = await this.database.entityManager.findOne(MomentLabelEntity, {
          where: {
            name: tag,
          },
        });
        if (momentLabelExisting) return momentLabelExisting.id;
        const momentLable = new MomentLabelEntity();
        momentLable.name = tag;
        const momentLabel = await this.database.entityManager.save(MomentLabelEntity, momentLable);
        return momentLabel.id;
      }),
    );
    // 2.存储moment
    const momentInfo = await this.database.momentRepo.save(moment);
    const rels = [];
    for (const id of momentLableIds) {
      rels.push({
        labelId: id,
        momentId: momentInfo.id,
      });
    }
    // 3.存储moment和label的关系
    this.database.momentLabelRelsRepo.insert(rels);
    return momentInfo;
  }

  async findMultiMoments(paginationParams: PaginationQueryDto) {
    let { keywords } = paginationParams;
    keywords = keywords ?? '';
    const curpage = Number.parseInt(paginationParams.curpage);
    const pagesize = Number.parseInt(paginationParams.pagesize);
    const [moments, count] = await this.database.momentRepo.findAndCount({
      relations: ['labels'],
      where: {
        content: Like(`%${keywords}%`),
      },
      order: { id: 'DESC' },
      skip: pagesize * (curpage - 1),
      take: pagesize,
    });

    await Promise.all(
      moments.map(async (item) => {
        item.images = await this.deepMinioService.getFileUrls(item.images, bucketName);
      }),
    );

    return {
      moments,
      count,
    };
  }

  async findOne(id: number) {
    const momentEntity = await this.database.momentRepo.findOne({
      where: {
        id,
      },
      relations: ['labels'],
    });
    if (!momentEntity) return null;
    momentEntity.images = await this.deepMinioService.getFileUrls(momentEntity.images, bucketName);
    return momentEntity;
  }

  async remove(id: number) {
    // DOTO: 如果该标签下没有任何一篇文章，标签也应该删除
    return this.database.momentRepo.delete(id);
  }

  async lockMoment(id: string) {
    const moment = await this.database.momentRepo.findOne({
      where: { id: +id },
    });
    if (moment) {
      moment.status = moment.status === 0 ? 1 : 0;
      return this.database.momentRepo.save(moment);
    } else {
      throw new DeepHttpException(CmsErrorMsg.MOMENT_NOT_EXEITST, CmsErrorCode.MOMENT_NOT_EXEITST);
    }
  }
}
