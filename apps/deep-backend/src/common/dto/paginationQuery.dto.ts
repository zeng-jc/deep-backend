export enum categoryEnum {
  '文章' = 'articleRepo',
  '动态' = 'momentRepo',
  '用户' = 'questionRepo',
  '问题' = 'userRepo',
}

export enum sortEnum {
  createTime = 'createAt',
  hot = 'hot',
}

export class PaginationQueryDto {
  pagenum!: string;
  pagesize!: string;
  keywords?: string;
  labelId?: string;
  category?: categoryEnum;
  sortMode?: sortEnum;
}
