import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '@app/deep-cache';
import { DeepMinioService } from '@app/deep-minio';
import { MomentEntity, MomentLabelEntity, MomentLabelRelationEntity, MomentLikesEntity } from '@app/deep-orm';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { DeepHttpException, ErrorCode, ErrorMsg } from '@app/common/exceptionFilter';
import { extname } from 'path';
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
      (Array.isArray(labels) ? labels : [labels]).map(async (tag) => {
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

  // TODO: 需要优化sql（还需要查询出点赞数量）
  async findMomentList(paginationParams: PaginationQueryDto) {
    const { content, username, labelId } = paginationParams;
    const pagenum = +paginationParams.pagenum;
    const pagesize = +paginationParams.pagesize;
    let query = this.database.momentRepo
      .createQueryBuilder('moment')
      .leftJoinAndSelect('moment.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .leftJoin('moment.user', 'user')
      .addSelect(['user.avatar', 'user.username', 'user.nickname', 'user.level'])
      .orderBy('moment.id', 'DESC')
      .skip(pagesize * (pagenum - 1))
      .take(pagesize);
    if (content) {
      query = query.where('moment.content LIKE :content', { content: `%${content}%` });
    }
    if (labelId) {
      query = query.andWhere('labels.labelId = :labelId', { labelId });
    }
    if (username) {
      query = query.andWhere('user.username = :username', { username });
    }
    const [list, total] = await query.getManyAndCount();
    // 动态标签处理
    list.forEach((momentEntity) => {
      momentEntity.labels = momentEntity.labels.map((item) => item.label.name) as unknown as MomentLabelRelationEntity[];
    });
    await Promise.all(
      list.map(async (item) => {
        item.images = item.images ? await this.deepMinioService.getFileUrls(item.images, bucketName) : [];
        item.video = item.video ? await this.deepMinioService.getFileUrls(item.video, bucketName) : [];
        item.user.avatar = item.user.avatar
          ? await this.deepMinioService.getFileUrl(item.user.avatar, bucketNameEnum.deepAvatar)
          : '';
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
      .leftJoin('moment.user', 'user')
      .addSelect(['user.avatar', 'user.username', 'user.nickname', 'user.level'])
      .leftJoinAndSelect('moment.labels', 'labels')
      .leftJoin('labels.label', 'label')
      .addSelect(['label.name'])
      .getOne();
    if (!momentEntity) return null;
    momentEntity.momentLikes = (await this.database.momentLikesRepo.count({
      where: { momentId: momentEntity.id },
    })) as unknown as MomentLikesEntity;
    // 用户头像
    momentEntity.user.avatar =
      momentEntity.user.avatar && (await this.deepMinioService.getFileUrl(momentEntity.user.avatar, bucketNameEnum.deepAvatar));
    // 动态标签处理
    momentEntity.labels = momentEntity.labels.map((item) => item.label.name) as unknown as MomentLabelRelationEntity[];
    // 动态图片获取
    momentEntity.images = momentEntity.images && (await this.deepMinioService.getFileUrls(momentEntity.images, bucketName));
    // 动态视频获取
    momentEntity.video = momentEntity.video && (await this.deepMinioService.getFileUrls(momentEntity.video, bucketName));
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
    data?.images && (await this.deepMinioService.deleteFile(data.images, bucketName));
    // 删除视频
    data?.video && (await this.deepMinioService.deleteFile(data.video, bucketName));
    return this.database.momentRepo.delete(id);
  }

  async changeMomentStatus(id: string) {
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
}
