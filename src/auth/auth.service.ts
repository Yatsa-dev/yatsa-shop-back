import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { UsersService } from '../users/users.service';
import { PayloadDto } from './dto/payload.dto';
import { LoginDto } from './dto/login.dto';
import {
  BCRYPT,
  INVALID_CREDENTIALS,
  MOMENT,
  WRONG_PASSWORD,
} from './auth.constants';
import { Users } from '../users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MOMENT) private moment,
    @Inject(BCRYPT) private bcrypt,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
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

  async generateCredentials(user: Users) {
    const payload: PayloadDto = { userId: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwtSecret'),
      }),
      expires_at: this.moment()
        .add(this.configService.get<number>('jwtExpiresInt'), 'seconds')
        .unix(),
    };
  }
}
