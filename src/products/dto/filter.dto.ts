import { IsOptional, IsString } from 'class-validator';
export class QueryFilter {
  @IsString()
  @IsOptional()
  market?: string;
}
