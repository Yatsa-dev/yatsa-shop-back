import * as moment from 'moment';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { HistoryService } from './history.service';
import { History } from './entity/history.entity';
import { MOMENT } from './history.constants';
import { HistoryController } from './history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([History]), UsersModule],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
    HistoryService,
  ],
  controllers: [HistoryController],
})
export class HistoryModule {}
