import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { UsersService } from '../users/users.service';
import { PayloadDto } from './dto/payload.dto';
import { LoginDto } from './dto/login.dto';
import {
  BCRYPT,
  INVALID_CREDENTIALS,
  INVALID_REFRESH_TOKEN,
  MOMENT,
  WRONG_PASSWORD,
} from './auth.constants';
import { Users } from '../users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refreshToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MOMENT) private moment,
    @Inject(BCRYPT) private bcrypt,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUserName(username);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passIsCorrect = await this.bcrypt.compare(password, user.password);

    if (!passIsCorrect) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUserName(loginDto.username);

    return this.generateCredentials(user);
  }

  async createRefreshToken(userId: number): Promise<RefreshToken> {
    const refreshToken = await this.refreshRepository.save({
      createdAt: new Date(),
      userId,
    });

    return refreshToken;
  }

  async findRefreshTokenById(tokenId: string): Promise<RefreshToken> {
    const token = await this.refreshRepository.findOneBy({ id: tokenId });

    return token;
  }

  async refresh(token: string): Promise<LoginResponseDto> {
    const refreshToken = await this.findRefreshTokenById(token);

    if (!refreshToken) {
      throw new BadRequestException(INVALID_REFRESH_TOKEN);
    }

    const user = await this.usersService.findById(refreshToken.userId);

    return this.login({ username: user.username, password: user.password });
  }

  async generateCredentials(user: Users) {
    const payload: PayloadDto = { userId: user.id, email: user.email };
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwtSecret'),
      }),
      expires_at: this.moment()
        .add(this.configService.get<number>('jwtExpiresInt'), 'seconds')
        .unix(),
      refresh_token: refreshToken.id,
    };
  }

  async logout(userId: number): Promise<{ success: boolean }> {
    await this.refreshRepository.delete({ userId });

    return { success: true };
  }
}
