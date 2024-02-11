import { SetMetadata } from '@nestjs/common';

export const tableName = (tableName: string) => SetMetadata('tableName', tableName);
