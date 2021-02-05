import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStore } from './productStore.entity';
import { StoreService } from 'src/stores/store.service';
import { Store } from './store.entity';
import { FileUploadService } from './fileUpload.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([ProductStore, Store]),
  ],
  providers: [ProductService, StoreService, FileUploadService],
})
export class XmlModule {}
