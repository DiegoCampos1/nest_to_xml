import { Module } from '@nestjs/common';
import { AppController } from './xml.controller';
import { AppService } from './xml.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStore } from './productStore.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([ProductStore])],
  controllers: [AppController],
  providers: [AppService],
})
export class XmlModule {}
