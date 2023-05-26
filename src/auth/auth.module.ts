import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { BCRYPT, GOOGLE_AUTH, MOMENT } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from '../users/entity/users.entity';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { OAuth2Client } from 'google-auth-library';
import { RefreshToken } from './entity/refreshToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.jwtSecret'),
          signOptions: {
            expiresIn: configService.get<number>('jwt.jwtExpiresInt'),
          },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    ConfigModule,
    UsersModule,
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
    {
      provide: BCRYPT,
      useValue: bcrypt,
    },
    {
      provide: GOOGLE_AUTH,
      useFactory: (configService: ConfigService) =>
        new OAuth2Client(
          configService.get<string>('googleClientId'),
          configService.get<string>('googleClientSecret'),
          'postmessage',
        ),
      inject: [ConfigService],
    },
    AuthService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
