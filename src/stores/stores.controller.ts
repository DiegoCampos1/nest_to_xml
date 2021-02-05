import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Put,
} from '@nestjs/common';
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
    return await this.storeService.getActiveStores();
  }

  // stores/:idStore/products/xml;
  // recebendo apenas o id;
  // @Put(); talvez Header: Content-Length: 0 -- NO SYNC
  // this.storeService.generateXmlForProducts(storeId);
  // const store = this.storeRepository.findById(idStore);
  // if(!store)throw new Exception(404, "Loja não encontrada")
  // if(!store.active || !store.type...) throw new Exception(400, "Loja inativa")
  // this.productService.generateXmlForProducts(store)
  // incluir no product -- if(products.length === 0) throw new Exception(404, "No products for store")

  @Put(':idStore/products/xml')
  async generateXmlByStoreId(@Param('idStore') idStore: number) {
    this.logger.debug('generateXmlByStoreId');
    try {
      await this.storeService.generateXmlById(idStore);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    return `Xml gerado e salvo com sucesso`;
  }
}
