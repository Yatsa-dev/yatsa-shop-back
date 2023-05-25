import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BCRYPT, MOMENT } from './users.constanst';
import { UsersService } from './users.service';
import { Users } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), ConfigModule, JwtModule],
  providers: [
    {
      provide: BCRYPT,
      useValue: bcrypt,
    },
    {
      provide: MOMENT,
      useValue: moment,
    },
    UsersService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
