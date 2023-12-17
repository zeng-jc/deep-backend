import { Injectable } from '@nestjs/common';

@Injectable()
export class DeepAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
