import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { staticMenu } from './static-menu';

@Injectable()
export class MenuService {
  create(createMenuDto: CreateMenuDto) {
    return 'This action adds a new menu' + createMenuDto;
  }

  findAll() {
    return `This action returns all menu`;
  }

  findOne(id: number) {
    console.log(id);
    return staticMenu;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu` + updateMenuDto;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
