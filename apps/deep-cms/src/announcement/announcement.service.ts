import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { DatabaseService } from '../database/database.service';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';

@Injectable()
export class AnnouncementService {
  constructor(private readonly database: DatabaseService) {}
  createAnnouncement(userId: number, { content }: CreateAnnouncementDto) {
    return this.database.announcementRepo.save({ userId, content });
  }
  async findAnnouncementList({ pagenum, pagesize }: PaginationQueryDto) {
    const [list, total] = await this.database.announcementRepo.findAndCount({
      take: pagesize,
      skip: (pagenum - 1) * pagesize,
      order: { id: 'DESC' },
    });
    return {
      list,
      total,
    };
  }
  removeAnnouncement(id: number) {
    return this.database.announcementRepo.delete(id);
  }
}
