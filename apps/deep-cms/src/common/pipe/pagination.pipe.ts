import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(
    value: PaginationQueryDto,
    _metadata: ArgumentMetadata,
  ): PaginationQueryDto {
    if (Object.is(Number.parseInt(value.curpage), NaN))
      throw new BadRequestException('curpage cannot be converted to a number');
    if (Object.is(Number.parseInt(value.pagesize), NaN))
      throw new BadRequestException('pagesize cannot be converted to a number');
    return value;
  }
}
