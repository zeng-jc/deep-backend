import { tableNameEnum } from '@app/deep-orm';

export enum categoryEnum {
  '文章' = tableNameEnum.article,
  '动态' = tableNameEnum.moment,
  '用户' = tableNameEnum.user,
}

export enum sortEnum {
  createTime = 'careteAt',
  hot = 'hot',
}

export class PaginationQueryDto {
  curpage!: string;
  pagesize!: string;
  keywords?: string;
  labelId?: string;
  category?: categoryEnum;
  sortMode?: string;
}
