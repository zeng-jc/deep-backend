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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { PaginationPipe } from '../common/pipe/pagination.pipe';
import { GetBodyIdPipe } from '../common/pipe/getBodyId.pipe';
import { ApiTags } from '@nestjs/swagger';
import { AssignRoleUserDto } from './dto/assignRole-user.dto';
import { Permissions, Roles } from '../common/decorator/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CmsErrorCode, CmsErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';

@Roles('admin')
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Permissions('create')
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/assignRole')
  assignRole(@Body() assignRoleUserDto: AssignRoleUserDto) {
    return this.userService.assignRole(assignRoleUserDto);
  }

  @Permissions('query')
  @Get()
  findMultiUser(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.userService.findMultiUser(query);
  }

  @Permissions('query')
  @Get(':id')
  findOneUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findOneUser(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  updateUser(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (file && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new DeepHttpException(CmsErrorMsg.AVATAR_UNSUPPORTED_FILE_TYPE, CmsErrorCode.AVATAR_UNSUPPORTED_FILE_TYPE);
    }
    return this.userService.updateUser(+id, updateUserDto, file);
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
