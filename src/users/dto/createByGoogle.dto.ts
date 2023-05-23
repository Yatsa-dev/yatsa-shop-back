import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateByAccountsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
