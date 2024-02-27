import { IsNotEmpty } from 'class-validator';

export class CreateQuestionAnswerDto {
  @IsNotEmpty()
  content: string;
}
