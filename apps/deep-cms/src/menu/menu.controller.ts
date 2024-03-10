import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Roles, Permissions } from '../common/decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AssignMenuDto } from './dto/assign-menu.dto';

@Roles('superAdmin')
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Permissions('create-menu')
  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Permissions('get-menu')
  @Get()
  findAllMenu() {
    return this.menuService.findAllMenu();
  }

  @Permissions('update-menu')
  @Patch(':id')
  updateMenu(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(+id, updateMenuDto);
  }

  @Permissions('delete-menu')
  @Delete(':id')
  removeMenu(@Param('id') id: string) {
    return this.menuService.removeMenu(+id);
  }

  @Permissions('assign-menu')
  // 给角色分配菜单
  @Post('assign-menu')
  assignMenu(@Body() assignMenuDto: AssignMenuDto) {
    return this.menuService.assignMenu(assignMenuDto);
  }
}
