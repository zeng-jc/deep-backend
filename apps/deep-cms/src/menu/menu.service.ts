import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { DatabaseService } from '../database/database.service';
import { DeepHttpException, ErrorCode, ErrorMsg } from '@app/common/exceptionFilter';
import { listToTree } from '../common/utils/listToTree';
import { AssignMenuDto } from './dto/assign-menu.dto';
import { In } from 'typeorm';
@Injectable()
export class MenuService {
  constructor(private readonly database: DatabaseService) {}
  async createMenu(createMenuDto: CreateMenuDto) {
    const { name, title, component, path, parentId, link, order, icon } = createMenuDto;
    try {
      return await this.database.menuRepo.save({
        parentId,
        name,
        title,
        component,
        path,
        link,
        order,
        icon,
      });
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  async findAllMenu() {
    const menus = await this.database.menuRepo.find();
    return listToTree(menus, 'parentId', 'subMenu');
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      await this.database.menuRepo.update(id, updateMenuDto);
      return true;
    } catch (error) {
      throw new DeepHttpException(ErrorMsg.DATABASE_HANDLE_ERROR, ErrorCode.DATABASE_HANDLE_ERROR);
    }
  }

  // 子菜单会自动级联删除
  async removeMenu(id: number) {
    return this.database.menuRepo.delete(id);
  }

  // 给角色分配菜单
  async assignMenu(assignMenuDto: AssignMenuDto) {
    const { menuIds, roleId } = assignMenuDto;
    const menus = await this.database.menuRepo.find({
      where: { id: In(menuIds) },
    });
    return this.database.roleRepo.save({
      menus,
      id: roleId,
    });
  }
}
