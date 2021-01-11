import { Module } from '@nestjs/common';
import { StoreController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../products/store.entity';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoresModule {}
