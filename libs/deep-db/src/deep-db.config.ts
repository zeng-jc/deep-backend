import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '123',
  database: 'coderhub',
  retryDelay: 500,
  retryAttempts: 5,
  synchronize: true,
  autoLoadEntities: true,
};
