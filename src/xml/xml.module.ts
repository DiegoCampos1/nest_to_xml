import { Module } from '@nestjs/common';
import { AppController } from './xml.controller';
import { AppService } from './xml.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStore } from './productStore.entity';
import { StoreService } from 'src/stores/store.service';
import { Store } from './store.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([ProductStore, Store]),
  ],
  controllers: [AppController],
  providers: [AppService, StoreService],
})
export class XmlModule {}
