import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Get()
  findAllPermission() {
    return this.permissionService.findAllPermission();
  }

  @Get(':id')
  findOnePermission(@Param('id') id: string) {
    return this.permissionService.findOnePermission(+id);
  }

  @Patch(':id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.updatePermission(+id, updatePermissionDto);
  }

  @Delete(':id')
  removePermission(@Param('id') id: string) {
    return this.permissionService.removePermission(+id);
  }
}
