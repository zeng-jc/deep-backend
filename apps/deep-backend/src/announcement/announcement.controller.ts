import { Controller, Get, Query } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';

@ApiTags('announcement')
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('/list')
  findAnnouncementList(@Query(new PaginationPipe()) paginationParams: PaginationQueryDto) {
    return this.announcementService.findAnnouncementList(paginationParams);
  }
}
