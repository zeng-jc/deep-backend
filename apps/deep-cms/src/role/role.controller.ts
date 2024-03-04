import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/auth.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';

@Roles('admin')
@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Post('/assignRole')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.roleService.assignRole(assignRoleDto);
  }

  @Get('/list')
  findRoleList(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.roleService.findRoleList(query);
  }

  @Get(':id')
  findOneRole(@Param('id') id: string) {
    return this.roleService.findOneRole(+id);
  }

  @Patch(':id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  removeRole(@Param('id') id: string) {
    return this.roleService.removeRole(+id);
  }
}
