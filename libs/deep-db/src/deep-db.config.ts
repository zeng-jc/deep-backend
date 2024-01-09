import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configLoader } from '@app/common/configLoader';

export const dbConfig: TypeOrmModuleOptions = configLoader('mysql');
