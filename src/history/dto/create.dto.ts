import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => IsNumber)
  @Transform(({ value }) => Number(value))
  amount: number;

  createdAt?: string;

  user?: any;
}
