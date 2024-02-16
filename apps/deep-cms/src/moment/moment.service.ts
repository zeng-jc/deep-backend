import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentEntity, MomentLabelEntity, MomentLabelRelationEntity } from '@app/deep-orm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
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
    const { keywords, labelId } = paginationParams;
    const curpage = +paginationParams.curpage;
    const pagesize = +paginationParams.pagesize;
    let query = this.database.momentRepo.createQueryBuilder('moment');
    query = query
      .leftJoinAndSelect('moment.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .orderBy('moment.id', 'DESC')
      .skip(pagesize * (curpage - 1))
      .take(pagesize);
    if (keywords) {
      query = query.where('moment.content LIKE :keywords', { keywords: `%${keywords}%` });
    }
    if (labelId) {
      query = query.andWhere('labels.labelId = :labelId', { labelId });
    }
    const [moments, total] = await query.getManyAndCount();
    // 动态标签处理
    moments.forEach((momentEntity) => {
      momentEntity.labels = momentEntity.labels.map((item) => item.label.name) as unknown as MomentLabelRelationEntity[];
    });
    await Promise.all(
      moments.map(async (item) => {
        item.images = await this.deepMinioService.getFileUrls(item.images, bucketName);
      }),
    );

    return {
      moments,
      total,
    };
  }

  async findOne(id: number) {
    const momentEntity = await this.database.momentRepo
      .createQueryBuilder('moment')
      .where('moment.id = :id', { id })
      .leftJoinAndSelect('moment.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .getOne();
    // 动态标签处理
    momentEntity.labels = momentEntity.labels.map((item) => item.label.name) as unknown as MomentLabelRelationEntity[];
    if (!momentEntity) return null;
    momentEntity.images =
      momentEntity.images.length && (await this.deepMinioService.getFileUrls(momentEntity.images, bucketName));
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
      throw new DeepHttpException(CmsErrorMsg.MOMENT_NOT_EXIST, CmsErrorCode.MOMENT_NOT_EXIST);
    }
  }

  async toggleLikes(userId: number, momentId: number) {
    // 1.查询有没有点赞
    const data = await this.database.momentLikesRepo.findOne({ where: { userId, momentId } });
    if (data) {
      await this.database.momentLikesRepo.delete({ userId, momentId });
      return { message: 'cancel' };
    } else {
      return await this.database.momentLikesRepo.save({ userId, momentId });
    }
  }
}
