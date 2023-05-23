import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { LoginResponseDto } from '../auth/dto/loginResponse.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: LoginResponseDto })
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
