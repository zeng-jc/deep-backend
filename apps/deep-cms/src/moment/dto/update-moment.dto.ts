import { PartialType } from '@nestjs/mapped-types';
import { CreateMomentDto } from './create-moment.dto';

export class UpdateMomentDto extends PartialType(CreateMomentDto) {}
