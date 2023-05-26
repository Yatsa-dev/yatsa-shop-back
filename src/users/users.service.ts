import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.dto';
import { Users } from './entity/users.entity';
import { BCRYPT, MOMENT, USER_EXIST } from './users.constanst';
import { ConfigService } from '@nestjs/config';
import { CreateByAccountsDto } from './dto/createByGoogle.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from 'src/auth/dto/loginResponse.dto';
import { RefreshToken } from 'src/auth/entity/refreshToken.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(BCRYPT) private bcrypt,
    @Inject(MOMENT) private moment,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    const isExist = await this.userRepository.findOneBy({
      username: createUserDto?.username,
    });
    if (isExist) {
      throw new BadRequestException(USER_EXIST);
    }
    const hash = await this.bcrypt.hash(
      createUserDto.password,
      this.configService.get<number>('saltRounds'),
    );
    createUserDto.password = hash;

    const user = await this.userRepository.save(createUserDto);

    return this.generateCredentials(user);
  }

  async createByAccounts(
    createByGoogleDto: CreateByAccountsDto,
  ): Promise<Users> {
    const user = await this.userRepository.save(createByGoogleDto);

    return user;
  }

  async findById(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<Users> {
    return this.userRepository.findOneBy({ email });
  }

  async findByUserName(username: string): Promise<Users> {
    return this.userRepository.findOneBy({ username });
  }

  async createRefreshToken(userId: number): Promise<RefreshToken> {
    const refreshToken = await this.refreshRepository.save({
      createdAt: new Date(),
      userId,
    });

    return refreshToken;
  }

  async generateCredentials(user: Users): Promise<LoginResponseDto> {
    const payload: PayloadDto = { userId: user.id, email: user.email };
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.jwtSecret'),
      }),
      expires_at: this.moment()
        .add(this.configService.get<number>('jwtExpiresInt'), 'seconds')
        .unix(),
      refresh_token: refreshToken.id,
    };
  }
}
