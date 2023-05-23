import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { PayloadDto } from '../auth/dto/payload.dto';
import { User } from '../decorators/user.decorator';
import { CreateHistoryDto } from './dto/create.dto';
import { History } from './entity/history.entity';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [History] })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  find(@User() user: PayloadDto): Promise<History[]> {
    return this.historyService.findAll(user.userId);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: History })
  @ApiBearerAuth()
  @Post('save')
  @UseGuards(AuthGuard('jwt'))
  saveOrder(
    @User() user: PayloadDto,
    @Body() createHistoryDto: CreateHistoryDto,
  ): Promise<History> {
    return this.historyService.create(user.userId, createHistoryDto);
  }
}
