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
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  @Post('/lock-user')
  lockUser(@Body(new GetBodyIdPipe()) id: string) {
    return this.userService.lockUser(id);
  }

  // 关注用户
  @Post('/follow-user/:id')
  followUser(@Headers() headers, @Param('id') id: string) {
    const { id: userId }: { id: number } = JSON.parse(headers.authorization);
    return this.userService.followUser(+userId, +id);
  }

  // 粉丝人数
  @Get('/follower-count/:id')
  async getFollowerCount(@Param('id') id: string) {
    return this.userService.getFollowerCount(+id);
  }

  // 关注人数
  @Get('/following-count/:id')
  async getFollowingCount(@Param('id') id: string) {
    return this.userService.getFollowingCount(+id);
  }

  // 粉丝列表
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
