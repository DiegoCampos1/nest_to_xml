import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductStore} from './productStore.entity';
import {HealthModule} from "./health/health.module";

@Module({
    imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([ProductStore]), HealthModule],
    controllers: [AppController,],
    providers: [AppService],
})
export class AppModule {
}
