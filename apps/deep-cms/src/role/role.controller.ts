import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles, Permissions } from '../common/decorator/auth.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { GetBodyIdPipe } from '../common/pipe/getBodyId.pipe';

@Roles('superAdmin')
@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions('create-role')
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Permissions('assign-role')
  @Post('/assignRole')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.roleService.assignRole(assignRoleDto);
  }

  @Permissions('query-role-list')
  @Get('/list')
  findRoleList(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.roleService.findRoleList(query);
  }

  @Permissions('query-role')
  @Get(':id')
  findOneRole(@Param('id') id: string) {
    return this.roleService.findOneRole(+id);
  }

  @Permissions('update-role')
  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Permissions('delete-role')
  @Delete(':id')
  removeRole(@Param('id') id: string) {
    return this.roleService.removeRole(+id);
  }

  @Permissions('update-role')
  @Post('/change-status')
  changeRoleStatus(@Body(new GetBodyIdPipe()) id: string) {
    return this.roleService.changeRoleStatus(id);
  }
}
