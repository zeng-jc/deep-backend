import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { PaginationPipe } from '../pipe/pagination.pipe';
import { GetBodyIdPipe } from '../pipe/getBodyId.pipe';
import { ApiTags } from '@nestjs/swagger';
import { AssignRoleUserDto } from './dto/assignRole-user.dto';
import { Permissions } from '../common/public.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Permissions('create')
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/assginRole')
  assginRole(@Body() assignRoleUserDto: AssignRoleUserDto) {
    return this.userService.assginRole(assignRoleUserDto);
  }

  @Get()
  findMultiUser(
    @Query(new PaginationPipe())
    query: QueryUserDto,
  ) {
    return this.userService.findMultiUser(query);
  }

  @Get(':id')
  findOneUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findOneUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  @Post('/lockUser')
  lockUser(@Body(new GetBodyIdPipe()) id: string) {
    return this.userService.lockUser(id);
  }
}
