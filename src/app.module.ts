import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { XmlModule } from './xml/xml.module';
@Module({
  imports: [TypeOrmModule.forRoot(), XmlModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
