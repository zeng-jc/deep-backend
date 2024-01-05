import { Global, Module } from '@nestjs/common';
import { DeepAmqpService } from './deep-amqp.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { amqpConfig } from './deep-amqp.config';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => {
        return amqpConfig;
      },
    }),
  ],
  providers: [DeepAmqpService],
  exports: [DeepAmqpService],
})
export class DeepAmqpModule {}
