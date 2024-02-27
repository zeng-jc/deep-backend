import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { PaginationQueryDto } from './common/dto/paginationQuery.dto';

@Injectable()
export class AppService {
  constructor(private readonly database: DatabaseService) {}
  globalSearch(query: PaginationQueryDto) {
    const { curpage, pagesize, keywords, category, sortMode } = query;

    return { curpage, pagesize, keywords, category, sortMode };
  }
}
