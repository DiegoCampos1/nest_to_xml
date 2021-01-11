import { Module } from '@nestjs/common';
import { AppController } from './generate_xml_products.controller';
import { AppService } from './generate_xml_products.service';
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
