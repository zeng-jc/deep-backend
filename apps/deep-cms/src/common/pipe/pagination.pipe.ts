import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: PaginationQueryDto, _metadata: ArgumentMetadata): PaginationQueryDto {
    if (!Number.isInteger(+value.pagenum) || !Number.isInteger(+value.pagesize)) throw new BadRequestException();
    value.pagenum = +value.pagenum;
    value.pagesize = +value.pagesize;
    value.keywords = value.keywords ?? '';
    return value;
  }
}
