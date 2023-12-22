import { Global, Module } from '@nestjs/common';
import { DeepAmqpService } from './deep-amqp.service';
import {
  MessageHandlerErrorBehavior,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => {
        return {
          exchanges: [
            {
              name: 'exchange_test',
              type: 'direct',
              options: { durable: false },
            },
          ],
          uri: 'amqp://guest:guest@localhost:5672',
          connectionInitOptions: { wait: false },
          enableDirectReplyTo: false,
          prefetchCount: 300,
          defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.ACK,
        };
      },
    }),
  ],
  providers: [DeepAmqpService],
  exports: [DeepAmqpService],
})
export class DeepAmqpModule {}
