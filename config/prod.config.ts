export const prodConfig = {
  cmsService: {
    host: '127.0.0.1',
    port: 3003,
  },
  mysql: {
    type: 'mysql',
    host: 'xx',
    port: 3306,
    username: 'root',
    password: '123',
    database: 'deep',
    retryDelay: 500,
    retryAttempts: 5,
    synchronize: true,
    autoLoadEntities: true,
  },
  redis: {
    socket: {
      host: 'xx',
      port: 6379,
    },
  },
  rabbitmq: {
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
    defaultSubscribeErrorBehavior: 'ACK',
  },
};
