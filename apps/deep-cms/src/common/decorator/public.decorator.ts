import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('public', true);

export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
