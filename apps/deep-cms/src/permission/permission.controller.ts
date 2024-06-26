import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles, Permissions } from '../common/decorator/auth.decorator';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';

@Roles('superAdmin')
@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permissions('create-permission')
  @Post()
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Permissions('assign-permission')
  @Post('/assignPermissions')
  assignPermissions(@Body() assignPermissionDto: AssignPermissionDto) {
    return this.permissionService.assignPermissions(assignPermissionDto);
  }

  @Permissions('find-permission-list')
  @Get('/list')
  findAllPermission(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.permissionService.findAllPermission(query);
  }

  @Permissions('find-permission')
  @Get(':id')
  findOnePermission(@Param('id') id: string) {
    return this.permissionService.findOnePermission(+id);
  }

  @Permissions('update-permission')
  @Patch(':id')
  updatePermission(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.updatePermission(+id, updatePermissionDto);
  }

  @Permissions('delete-permission')
  @Delete(':id')
  removePermission(@Param('id') id: string) {
    return this.permissionService.removePermission(+id);
  }
}
