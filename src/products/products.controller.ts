import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../decorators/user.decorator';
import { PayloadDto } from '../auth/dto/payload.dto';
import { CreateProductDto } from './dto/create.dto';
import { Product } from './entity/products.entity';
import { QueryFilter } from './dto/filter.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOkResponse({ type: [Product] })
  @Get()
  find(@Query() query: QueryFilter): Promise<Product[]> {
    return this.productsService.findAll(query);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: Product })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @User() user: PayloadDto,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Product> {
    return this.productsService.create(user.userId, createProductDto, file);
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:productId')
  delete(
    @User() user: PayloadDto,
    @Param('productId') productId: number,
  ): Promise<{ success: boolean }> {
    return this.productsService.delete(user.userId, productId);
  }
}
