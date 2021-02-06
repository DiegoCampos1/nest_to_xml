import { Module } from '@nestjs/common';
import { StoreController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../products/store.entity';
import { StoreService } from './store.service';
import { ProductService } from 'src/products/products.service';
import { FileUploadService } from 'src/products/fileUpload.service';
import { ProductStore } from 'src/products/productStore.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Store, ProductStore]),
  ],
  controllers: [StoreController],
  providers: [StoreService, ProductService, FileUploadService],
})
export class StoresModule {}
