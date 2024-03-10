import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import { Permissions, Roles } from '../common/decorator/auth.decorator';

@Roles('admin')
@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Permissions('query-stats')
  @Get('/all')
  statsAll() {
    return this.statsService.statsAll();
  }
}
