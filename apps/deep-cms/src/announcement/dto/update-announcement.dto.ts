import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto';

export class UpdateArticleDto extends PartialType(CreateAnnouncementDto) {}
