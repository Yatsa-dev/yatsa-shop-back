import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { User } from '../decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@User() user): Promise<LoginResponseDto> {
    return this.authService.generateCredentials(user);
  }
}
