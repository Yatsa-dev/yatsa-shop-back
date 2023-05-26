import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { User } from '../decorators/user.decorator';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { PayloadDto } from './dto/payload.dto';

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

  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse()
  @Post('refresh')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@User() user: PayloadDto): Promise<{ success: boolean }> {
    return this.authService.logout(user.userId);
  }
}
