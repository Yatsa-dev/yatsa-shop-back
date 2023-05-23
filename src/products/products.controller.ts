import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
import { UpdateProductDto } from './dto/update.dto';
import { Product } from './entity/products.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOkResponse({ type: [Product] })
  @Get()
  find(): Promise<Product[]> {
    return this.productsService.findAll();
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
  @Patch('update/:productId')
  update(
    @User() user: PayloadDto,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<{ success: boolean }> {
    return this.productsService.update(
      user.userId,
      productId,
      updateProductDto,
    );
  }

  @ApiUnauthorizedResponse()
  @ApiResponse({ status: 200, description: 'Return `{success: true}`' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('update/file/:productId')
  @UseInterceptors(FileInterceptor('file'))
  updateFile(
    @User() user: PayloadDto,
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ success: boolean }> {
    return this.productsService.updateFile(user.userId, productId, file);
  }
}