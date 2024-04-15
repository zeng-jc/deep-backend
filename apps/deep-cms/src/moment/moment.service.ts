import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentEntity, MomentLabelEntity, MomentLabelRelationEntity } from '@app/deep-orm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { DeepMinioService } from '@app/deep-minio';
import { extname } from 'path';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';
import { CacheService } from '@app/deep-cache';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';

const bucketName = bucketNameEnum.deepMoment;

@Injectable()
export class MomentService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  async create(userId: number, files: Express.Multer.File[], createMomentDto: CreateMomentDto, type: string) {
    const { content, labels } = createMomentDto;
    const user = await this.database.userRepo.findOne({
      where: {
        id: Number(userId) || 0,
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
    moment.content = content;
    moment.user = user;
    // 1. 获取lable的id
    const momentLableIds = await Promise.all(
      labels?.map(async (tag) => {
        const momentLabelExisting = await this.database.entityManager.findOne(MomentLabelEntity, {
          where: {
            name: tag,
          },
        });
        if (momentLabelExisting) return momentLabelExisting.id;
        const momentLable = new MomentLabelEntity();
        momentLable.name = tag;
        momentLable.userId = userId;
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

  // TODO: 需要优化sql
  async findMomentList(paginationParams: PaginationQueryDto) {
    const { keywords, labelId } = paginationParams;
    const pagenum = +paginationParams.pagenum;
    const pagesize = +paginationParams.pagesize;
    let query = this.database.momentRepo
      .createQueryBuilder('moment')
      .leftJoinAndSelect('moment.user', 'user')
      .leftJoinAndSelect('moment.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .orderBy('moment.id', 'DESC')
      .skip(pagesize * (pagenum - 1))
      .take(pagesize);
    if (keywords) {
      query = query.where('moment.content LIKE :keywords', { keywords: `%${keywords}%` });
    }
    if (labelId) {
      query = query.andWhere('labels.labelId = :labelId', { labelId });
    }
    const [list, total] = await query.getManyAndCount();
    // 动态标签处理
    list.forEach((momentEntity) => {
      momentEntity.labels = momentEntity.labels.map((item) => item.label.name) as unknown as MomentLabelRelationEntity[];
    });
    await Promise.all(
      list.map(async (item) => {
        item.images = await this.deepMinioService.getFileUrls(item.images, bucketName);
      }),
    );

    return {
      list,
      total,
    };
  }

  async findOneMoment(id: number) {
    const cacheMoment = await this.cacheService.get(`moment.findOneMoment.${id}`);
    if (cacheMoment) return cacheMoment;
    const momentEntity = await this.database.momentRepo
      .createQueryBuilder('moment')
      .where('moment.id = :id', { id })
      .leftJoinAndSelect('moment.user', 'user')
      .leftJoinAndSelect('moment.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .getOne();
    if (!momentEntity) return null;
    // 动态标签处理
    momentEntity.labels = momentEntity.labels.map((item) => item.label.name) as unknown as MomentLabelRelationEntity[];
    momentEntity.images = momentEntity.images && (await this.deepMinioService.getFileUrls(momentEntity.images, bucketName));
    // 增加浏览量
    await this.database.momentRepo
      .createQueryBuilder()
      .update()
      .set({ viewCount: momentEntity.viewCount + 1 })
      .where('id = :id', { id })
      .execute();
    // 缓存
    this.cacheService.set(`moment.findOneMoment.${id}`, momentEntity, 60);
    return momentEntity;
  }

  // TODO: 如果该标签下没有任何一篇文章，标签也应该删除
  async remove(id: number) {
    const data = await this.database.momentRepo.findOne({ where: { id }, select: ['images'] });
    // 删除图片
    await this.deepMinioService.deleteFile(data.images, bucketName);
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
      throw new DeepHttpException(ErrorMsg.MOMENT_NOT_EXIST, ErrorCode.MOMENT_NOT_EXIST);
    }
  }

  async toggleLikes(userId: number, momentId: number) {
    // 1.查询有没有点赞
    const data = await this.database.momentLikesRepo.findOne({ where: { userId, momentId } });
    if (data) {
      await this.database.momentLikesRepo.delete({ userId, momentId });
      return false;
    } else {
      await this.database.momentLikesRepo.save({ userId, momentId });
      return true;
    }
  }

  async findMomentLabelList(paginationParams: PaginationQueryDto) {
    const { name, pagenum, pagesize } = paginationParams;
    let query = this.database.momentLabelRepo
      .createQueryBuilder('momentLable')
      .leftJoinAndSelect('momentLable.user', 'user')
      .orderBy('momentLable.id', 'DESC')
      .skip(pagesize * (pagenum - 1))
      .take(pagesize);
    if (name) {
      query = query.where('momentLable.name LIKE :name', { name: `%${name}%` });
    }
    const [list, total] = await query.getManyAndCount();
    return {
      list,
      total,
    };
  }

  async deleteMomentLabelList(id: number) {
    await this.database.momentLabelRepo.delete({ id });
  }
  async createMomentLabelList(userId: number, name: string) {
    try {
      await this.database.momentLabelRepo.save({ userId, name });
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.ARTICLE_LABEL_EXIST, ErrorCode.ARTICLE_LABEL_EXIST);
    }
  }
}
