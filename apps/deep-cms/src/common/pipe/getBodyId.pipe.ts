import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class GetBodyIdPipe implements PipeTransform {
  transform(value: { id: string }, _metadata: ArgumentMetadata) {
    return value.id;
  }
}
