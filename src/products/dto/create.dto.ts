import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => IsNumber)
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  file?: string;
}
