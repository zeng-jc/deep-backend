import { Test, TestingModule } from '@nestjs/testing';
import { DeepAuthController } from './deep-auth.controller';
import { DeepAuthService } from './deep-auth.service';

describe('DeepAuthController', () => {
  let deepAuthController: DeepAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeepAuthController],
      providers: [DeepAuthService],
    }).compile();

    deepAuthController = app.get<DeepAuthController>(DeepAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deepAuthController.getHello()).toBe('Hello World!');
    });
  });
});
