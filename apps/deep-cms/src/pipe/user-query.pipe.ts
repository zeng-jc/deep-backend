import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { QueryUserDto } from '../user/dto/query-user.dto';

@Injectable()
export class UserQueryPipe implements PipeTransform {
  transform(value: QueryUserDto, _metadata: ArgumentMetadata): QueryUserDto {
    if (Object.is(Number.parseInt(value.curpage), NaN))
      throw new BadRequestException('curpage cannot be converted to a number');
    if (Object.is(Number.parseInt(value.pagesize), NaN))
      throw new BadRequestException('pagesize cannot be converted to a number');
    return value;
  }
}
