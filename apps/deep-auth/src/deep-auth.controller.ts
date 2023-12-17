import { Controller, Get } from '@nestjs/common';
import { DeepAuthService } from './deep-auth.service';

@Controller()
export class DeepAuthController {
  constructor(private readonly deepAuthService: DeepAuthService) {}

  @Get()
  getHello(): string {
    return this.deepAuthService.getHello();
  }
}
