export class CreateArticleDto {
  userId: number;
  content: string;
  labels?: string[];
  title: string;
}
