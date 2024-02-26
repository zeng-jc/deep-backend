import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { bucketNameEnum } from '@app/deep-minio/deep-minio.bucket-name';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '@app/deep-cache';
import { DeepMinioService } from '@app/deep-minio';
import { ArticleEntity, ArticleLabelEntity, ArticleLabelRelationEntity } from '@app/deep-orm';
import { extname } from 'path';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

const bucketName = bucketNameEnum.deepArticle;

@Injectable()
export class ArticleService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly deepMinioService: DeepMinioService,
  ) {}
  // TODO：sql需要优化
  async createArticle(
    files: { images?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    createArticleDto: CreateArticleDto,
  ) {
    const { userId, content, labels, title } = createArticleDto;
    const { images, cover } = files;
    const article = new ArticleEntity();

    // 查询出user
    const user = await this.database.userRepo.findOne({
      where: {
        id: Number(userId) || 0,
      },
    });
    article.user = user;
    article.content = content;
    article.title = title;

    // 1. 获取lable的id
    const articleLableIds = await Promise.all(
      labels?.map(async (tag) => {
        const articleLabelExisting = await this.database.entityManager.findOne(ArticleLabelEntity, {
          where: {
            name: tag,
          },
        });
        if (articleLabelExisting) return articleLabelExisting.id;
        const articleLable = new ArticleLabelEntity();
        articleLable.name = tag;
        const articleLabel = await this.database.entityManager.save(ArticleLabelEntity, articleLable);
        return articleLabel.id;
      }),
    );

    // 2.图片处理存储到minio
    if (images.length) {
      await this.deepMinioService.uploadFiles(images, bucketName);
      article.images = images.map((item) => item.originalname);
    }
    if (cover?.length) {
      cover[0].originalname = new Date().getTime() + extname(cover[0].originalname);
      await this.deepMinioService.uploadFile(cover[0], bucketName);
      article.cover = cover[0].originalname;
    }

    // 3.存储article
    const articleInfo = await this.database.articleRepo.save(article);
    const rels = [];
    for (const id of articleLableIds) {
      rels.push({
        labelId: id,
        articleId: articleInfo.id,
      });
    }
    // 4.存储article和label的关系
    this.database.articleLabelRelsRepo.insert(rels);

    return articleInfo;
  }

  // TODO: 需要优化sql（还需要查询出点赞数量）
  async findMultiArticle(paginationParams: PaginationQueryDto) {
    const { keywords, labelId } = paginationParams;
    const curpage = +paginationParams.curpage;
    const pagesize = +paginationParams.pagesize;
    let query = this.database.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .orderBy('article.id', 'DESC')
      .skip(pagesize * (curpage - 1))
      .take(pagesize);
    if (keywords) {
      query = query.where('article.content LIKE :keywords', { keywords: `%${keywords}%` });
    }
    if (labelId) {
      query = query.andWhere('labels.labelId = :labelId', { labelId });
    }
    const [articles, total] = await query.getManyAndCount();
    // 文章标签处理
    articles.forEach((articleEntity) => {
      articleEntity.labels = articleEntity.labels.map((item) => item.label.name) as unknown as ArticleLabelRelationEntity[];
    });

    await Promise.all(
      articles.map(async (item) => {
        item.cover = await this.deepMinioService.getFileUrl(item.cover, bucketName);
      }),
    );

    return {
      articles,
      total,
    };
  }

  async findOneArticle(id: number) {
    const cacheArticle = await this.cacheService.get(`article.findOneArticle.${id}`);
    if (cacheArticle) return cacheArticle;
    const articleEntity = await this.database.articleRepo
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.labels', 'labels')
      .leftJoinAndSelect('labels.label', 'label')
      .getOne();
    if (!articleEntity) return null;
    // 动态标签处理
    articleEntity.labels = articleEntity.labels.map((item) => item.label.name) as unknown as ArticleLabelRelationEntity[];
    // 动态图片获取
    articleEntity.cover = articleEntity.cover && (await this.deepMinioService.getFileUrl(articleEntity.cover, bucketName));
    // 增加浏览量
    await this.database.articleRepo
      .createQueryBuilder()
      .update()
      .set({ viewCount: articleEntity.viewCount + 1 })
      .where('id = :id', { id })
      .execute();
    // 缓存
    this.cacheService.set(`article.findOneArticle.${id}`, articleEntity, 60);
    return articleEntity;
  }

  // TODO: 如果该标签下没有任何一篇文章，标签也应该删除
  async removeArticle(id: number) {
    const data = await this.database.articleRepo.findOne({ where: { id }, select: ['cover'] });
    // 删除图片
    await this.deepMinioService.deleteFile(data?.cover, bucketName);
    await this.deepMinioService.deleteFile(data?.images, bucketName);
    return this.database.articleRepo.delete(id);
  }

  async lockArticle(id: string) {
    const article = await this.database.articleRepo.findOne({
      where: { id: +id },
    });
    article.status = article.status === 0 ? 1 : 0;
    return this.database.articleRepo.save(article);
  }

  async toggleLikes(userId: number, articleId: number) {
    // 1.查询有没有点赞
    const data = await this.database.articleLikesRepo.findOne({ where: { userId, articleId } });
    if (data) {
      await this.database.articleLikesRepo.delete({ userId, articleId });
      return false;
    } else {
      await this.database.articleLikesRepo.save({ userId, articleId });
      return true;
    }
  }

  async updateArticle(
    id: number,
    updateArticleDto: UpdateArticleDto,
    files: { images?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    const res = await this.database.articleRepo.find({
      where: {
        id,
      },
    });
    console.log(updateArticleDto, files);
    return res;
  }
}
