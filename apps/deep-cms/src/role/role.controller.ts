import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { AssignPermissionRoleDto } from './dto/assignPermission-role.dto';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Post('/assignPermissions')
  assignPermissions(@Body() assignPermissionRoleDto: AssignPermissionRoleDto) {
    return this.roleService.assignPermissions(assignPermissionRoleDto);
  }

  @Get()
  findAllRole() {
    return this.roleService.findAllRole();
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
