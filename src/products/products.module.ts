import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entity/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), StorageModule, UsersModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
