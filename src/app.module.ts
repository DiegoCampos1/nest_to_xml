import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { XmlModule } from './generate_xml_products/generate_xml_products.module';
import { StoresModule } from './stores/stores.module';
@Module({
  imports: [TypeOrmModule.forRoot(), XmlModule, HealthModule, StoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
