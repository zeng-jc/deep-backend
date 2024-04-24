import { Controller, Get, Post, Body, Param, Delete, Query, Headers } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AnnouncementService } from './announcement.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/auth.decorator';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';

@Roles('admin')
@ApiTags('announcement')
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('/create')
  createAnnouncement(@Headers() headers, @Body() createAnnouncementDto: CreateAnnouncementDto) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.announcementService.createAnnouncement(userId, createAnnouncementDto);
  }

  @Get('/list')
  findAnnouncementList(@Query(new PaginationPipe()) paginationParams: PaginationQueryDto) {
    return this.announcementService.findAnnouncementList(paginationParams);
  }

  @Delete('/delete/:id')
  removeAnnouncement(@Param('id') id: string) {
    return this.announcementService.removeAnnouncement(+id);
  }
}
