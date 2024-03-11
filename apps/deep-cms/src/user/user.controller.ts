import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Headers,
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
import { Permissions, Roles } from '../common/decorator/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorCode, ErrorMsg, DeepHttpException } from '@app/common/exceptionFilter';

@Roles('admin')
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Permissions('create-user')
  @Post('/create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Permissions('query-user-list')
  @Get('/list')
  findUserList(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.userService.findUserList(query);
  }

  @Permissions('query-user')
  @Get(':id')
  findOneUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findOneUser(id);
  }

  @Permissions('update-user')
  @Patch('/update/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  updateUser(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (file && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new DeepHttpException(ErrorMsg.AVATAR_UNSUPPORTED_FILE_TYPE, ErrorCode.AVATAR_UNSUPPORTED_FILE_TYPE);
    }
    return this.userService.updateUser(+id, updateUserDto, file);
  }

  @Permissions('delete-user')
  @Delete('/delete/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  @Permissions('set-user-status')
  @Post('/lock-user')
  lockUser(@Body(new GetBodyIdPipe()) id: string) {
    return this.userService.lockUser(id);
  }

  // 粉丝列表
  @Permissions('query-user')
  @Get('/followers/:id')
  async getFollowers(
    @Headers() headers,
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    if (!userId) return null;
    return this.userService.getFollowers(+id, query);
  }

  // 关注列表
  @Permissions('query-user')
  @Get('/following/:id')
  async getFollowing(
    @Headers() headers,
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.userService.getFollowing(+id, query);
  }

  // 点赞列表
  @Permissions('query-user')
  @Get('/likes-list/:id')
  async getLikesList(
    @Headers() headers,
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.userService.getLikesList(+id, query);
  }
}
