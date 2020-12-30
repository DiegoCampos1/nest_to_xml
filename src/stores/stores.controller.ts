import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';

@ApiTags('Active Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  private readonly logger = new Logger(StoreService.name);

  @Get()
  async findStoreActives() {
    this.logger.debug('findStoresActives');
    return this.storeService.storeActives();
  }
}
