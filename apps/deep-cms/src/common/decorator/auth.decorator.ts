import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('public', true);

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
