import { Controller, Get, Logger, Param } from '@nestjs/common';
import { AppService } from './products.service';
import { ProductStore } from './productStore.entity';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from 'src/stores/store.service';

@ApiTags('XML - generator')
@Controller('products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storeService: StoreService,
  ) {}
  private readonly logger = new Logger(AppController.name);

  @Get()
  async findXmlByAllStores(): Promise<any> {
    this.logger.debug('findXmlByAllStores');
    const storesActiveWithProducts = await this.storeService.storeActives();
    // this.storeService.storeActives();
    return this.appService.xmlGeneratorProductsAllStores(
      storesActiveWithProducts,
    );
  }

  @Get('/:redeId')
  async findXMLbyRedeId(
    @Param('redeId') redeId: string,
  ): Promise<ProductStore> {
    this.logger.debug('findXMLbyRedeId');
    return this.appService.xmlGeneratorProductsByRedeId(redeId);
  }
}
