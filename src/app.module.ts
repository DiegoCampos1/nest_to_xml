import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStore } from './productStore.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    HealthModule,
    TypeOrmModule.forFeature([ProductStore]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
