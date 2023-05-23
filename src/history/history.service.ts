import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entity/history.entity';
import { UsersService } from '../users/users.service';
import { CUSTOMER } from '../users/users.constanst';
import { MOMENT, NO_CUSTOMER } from './history.constants';
import { CreateHistoryDto } from './dto/create.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(MOMENT) private moment,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    private userService: UsersService,
  ) {}

  async create(
    userId: number,
    createHistoryDto: CreateHistoryDto,
  ): Promise<History> {
    const user = await this.userService.findById(userId);
    if (user.role !== CUSTOMER) {
      throw new BadRequestException(NO_CUSTOMER);
    }

    createHistoryDto.createdAt = this.moment.utc().format('YYYY-MM-DD');
    createHistoryDto.user = user.id;

    return this.historyRepository.save(createHistoryDto);
  }

  async findAll(userId: number): Promise<History[]> {
    return this.historyRepository.find({
      where: { user: userId },
      order: {
        id: 'DESC',
      },
    });
  }
}
