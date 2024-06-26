import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { tableName } from '../common/decorator/tableName.decorator';
import { tableNameEnum } from '@app/deep-orm';
import { PaginationPipe } from 'apps/deep-cms/src/common/pipe/pagination.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeepHttpException, ErrorCode, ErrorMsg } from '@app/common/exceptionFilter';
import { PaginationQueryDto } from '../common/dto/paginationQuery.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password';
@tableName(tableNameEnum.user)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  findUserList(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
  ) {
    return this.userService.findUserList(query);
  }

  // 用户详情
  @Get(':id')
  findOneUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findOneUser(id);
  }

  // 更新用户信息
  @Patch('/update/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  updateUser(@UploadedFile() file: Express.Multer.File, @Body() updateUserDto: UpdateUserDto) {
    if (file && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new DeepHttpException(ErrorMsg.AVATAR_UNSUPPORTED_FILE_TYPE, ErrorCode.AVATAR_UNSUPPORTED_FILE_TYPE);
    }
    return this.userService.updateUser(updateUserDto, file);
  }

  // 关注用户
  @Post('/follow-user/:id')
  followUser(@Headers() headers, @Param('id') id: string) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.userService.followUser(+userId, +id);
  }

  // 粉丝列表
  @Get('/followers/:id')
  async getFollowers(
    @Headers() headers,
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.userService.getFollowers(+id, query);
  }

  // 关注列表
  @Get('/following/:id')
  async getFollowing(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.userService.getFollowing(+id, query);
  }

  // 点赞列表
  @Get('/likes-list/:id')
  async getLikesList(
    @Query(new PaginationPipe())
    query: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.userService.getLikesList(+id, query);
  }

  // 修改密码
  @Post('/update-password')
  async updatePassword(@Headers() headers, @Body() body: UpdatePasswordDto) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.userService.updatePassword(+userId, body);
  }
}
