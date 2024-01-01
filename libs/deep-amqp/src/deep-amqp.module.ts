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
              name: 'deep_exchange',
              type: 'direct',
              options: { durable: false },
            },
          ],
          uri: 'amqp://guest:guest@127.0.0.1:5672',
          connectionInitOptions: { wait: false },
          enableDirectReplyTo: false,
          enableControllerDiscovery: true,
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
