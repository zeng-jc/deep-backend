import { MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq';

export const amqpConfig = {
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
