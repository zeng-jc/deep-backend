export const localConfig = {
  cmsService: {
    host: '127.0.0.1',
    port: 3003,
  },
  mysql: {
    type: 'mysql',
    host: '127.0.0.1',
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
      host: '127.0.0.1',
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
  email: {
    emailConfig: {
      host: 'smtp.163.com',
      secure: true,
      port: 465,
      auth: {
        user: 'xx@163.com',
        pass: '',
      },
    },
    emailFrom: 'xx@163.com',
  },
  minio: {
    endPoint: '127.0.0.1',
    port: 9090,
    useSSL: false,
    accessKey: '2356924146',
    secretKey: 'Qq2356924146',
  },
};
