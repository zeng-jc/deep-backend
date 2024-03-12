import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: PaginationQueryDto, _metadata: ArgumentMetadata): PaginationQueryDto {
    if (!Number.isInteger(+value.pagenum) || !Number.isInteger(+value.pagesize)) throw new BadRequestException();
    value.pagenum = value.pagenum ? +value.pagenum : 1;
    value.pagesize = value.pagesize ? +value.pagesize : 10;
    value.gender = value.gender ? +value.gender : undefined;
    value.keywords = value.keywords ?? '';
    value.username = value.username ?? '';
    return value;
  }
}
