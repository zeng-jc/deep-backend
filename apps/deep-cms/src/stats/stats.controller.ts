import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/auth.decorator';

@Roles('admin')
@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('user')
  userStats() {
    return this.statsService.userStats();
  }

  @Get('moment')
  momentStats() {
    return this.statsService.momentStats();
  }

  @Get('article')
  articleStats() {
    return this.statsService.articleStats();
  }
}
