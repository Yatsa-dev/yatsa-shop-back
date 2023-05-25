import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { LoginResponseDto } from '../auth/dto/loginResponse.dto';
import { User } from 'src/decorators/user.decorator';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { AuthGuard } from '@nestjs/passport';
import { Users } from './entity/users.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: LoginResponseDto })
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: Users })
  @Get('profile')
  getProfile(@User() user: PayloadDto): Promise<Users> {
    return this.usersService.findById(user.userId);
  }
}
