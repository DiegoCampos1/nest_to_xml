import { Module } from '@nestjs/common';
import { AppController } from './products.controller';
import { AppService } from './products.service';
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
  controllers: [AppController],
  providers: [AppService, StoreService, FileUploadService],
})
export class XmlModule {}
