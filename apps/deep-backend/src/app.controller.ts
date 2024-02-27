import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PaginationQueryDto } from './common/dto/paginationQuery.dto';
import { PaginationPipe } from './common/pipe/pagination.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('global/search')
  globalSearch(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.appService.globalSearch();
  }
}
