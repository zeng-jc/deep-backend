export class PaginationQueryDto {
  pagenum!: number;
  pagesize!: number;
  keywords?: string;
  content?: string;
  title?: string;
  labelId?: string;
  username?: string;
  gender?: number;
}
