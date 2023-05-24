import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { CreateProductDto } from './dto/create.dto';
import { UsersService } from '../users/users.service';
import { ADMIN } from '../users/users.constanst';
import { ACCESS_DENIED, PRODUCT_EXIST } from './products.constants';
import { UpdateProductDto } from './dto/update.dto';
import { StorageService } from '../storage/storage.service';
import { JPEG, NOT_SUPPORTED, PNG } from '../storage/storage.constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UsersService,
    private storageService: StorageService,
  ) {}

  async create(
    userId: number,
    createProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const user = await this.userService.findById(userId);
    if (user.role !== ADMIN) {
      throw new ForbiddenException(ACCESS_DENIED);
    } else {
      if (file) {
        const url = await this.checkExtensionsFromFile(file);
        createProductDto.file = url;
      }
      await this.checkProductName(createProductDto.name);

      return this.productRepository.save(createProductDto);
    }
  }

  async update(
    userId: number,
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findById(userId);
    if (user.role !== ADMIN) {
      throw new ForbiddenException(ACCESS_DENIED);
    } else {
      if (updateProductDto.name) {
        await this.checkProductName(updateProductDto.name);
      }

      await this.productRepository.update(productId, updateProductDto);

      return { success: true };
    }
  }

  async updateFile(
    userId: number,
    productId: number,
    file: Express.Multer.File,
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findById(userId);
    if (user.role !== ADMIN) {
      throw new ForbiddenException(ACCESS_DENIED);
    } else {
      const url = await this.checkExtensionsFromFile(file);

      await this.productRepository.update(productId, { file: url });

      return { success: true };
    }
  }

  async checkProductName(name: string): Promise<void> {
    const isExist = await this.productRepository.findOneBy({
      name,
    });
    if (isExist) {
      throw new BadRequestException(PRODUCT_EXIST);
    }
  }

  async checkExtensionsFromFile(file: Express.Multer.File): Promise<string> {
    let url: string;
    const extensionFile = await this.storageService.checkExtensionFile(file);
    switch (true) {
      case extensionFile === PNG:
        url = await this.storageService.validateImageSizeAndGetUrl(file);
        break;
      case extensionFile === JPEG:
        url = await this.storageService.validateImageSizeAndGetUrl(file);
        break;
      default:
        throw new BadRequestException(NOT_SUPPORTED);
    }

    return url;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async delete(
    userId: number,
    productId: number,
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findById(userId);

    if (user.role !== ADMIN) {
      throw new ForbiddenException(ACCESS_DENIED);
    } else {
      await this.productRepository.delete({ id: productId });

      return { success: true };
    }
  }
}
