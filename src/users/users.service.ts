import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.dto';
import { User } from './entity/users.entity';
import { BCRYPT, MOMENT, USER_EXIST } from './users.constanst';
import { ConfigService } from '@nestjs/config';
import { CreateByAccountsDto } from './dto/createByGoogle.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from 'src/auth/dto/loginResponse.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(BCRYPT) private bcrypt,
    @Inject(MOMENT) private moment,
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
  ): Promise<User> {
    const user = await this.userRepository.save(createByGoogleDto);

    return user;
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findByUserName(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async generateCredentials(user: User): Promise<LoginResponseDto> {
    const payload: PayloadDto = { userId: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.jwtSecret'),
      }),
      expires_at: this.moment()
        .add(this.configService.get<number>('jwtExpiresInt'), 'seconds')
        .unix(),
    };
  }
}
