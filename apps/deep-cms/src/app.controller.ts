import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './common/decorator/auth.decorator';

@Roles('admin')
@Controller('/')
@ApiBearerAuth()
export class AppController {
  constructor(private readonly deepCmsService: AppService) {}
}
