import { Body, Controller, Get, Logger, Param } from '@nestjs/common';
import { AppService } from './products.service';
import { ProductStore } from './productStore.entity';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from 'src/stores/store.service';
import { FileUploadService } from './fileUpload.service';
import { amendoin } from './scrpitsNode';
import * as fs from 'fs';
//import file from '../../dist/products/'

const mockUmuaramaDias = {
  id: 1,
  name: 'Supermercado Smart Umuarama',
  url: '/supermercado-smart-umuarama-uberlandia',
};
@ApiTags('XML - generator')
@Controller('products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storeService: StoreService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  private readonly logger = new Logger(AppController.name);

  @Get()
  async findXmlByAllStores(@Body() mockUmuaramaDias): Promise<any> {
    this.logger.debug('findXmlByAllStores');

    const timer = setInterval(() => {
      console.log(
        `Memory Usage: setInterval MB`,
        (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      );
    }, 500);

    //const storesActiveWithProducts = await this.storeService.getActiveStores();

    const productsXml = await this.appService.xmlGeneratorProductsAllStores(
      mockUmuaramaDias,
    );

    clearInterval(timer);

    //return productsXml;
    // const ls = await amendoin(productsXml);
    //return "Deu bom?";
    return this.fileUploadService.uploadXml(productsXml, mockUmuaramaDias.id);
    // return new Promise ((res, rej) => {
    //   fs.readFile(productsXml, 'utf8', (err, data) => {
    //     if (err) {
    //       console.error(err);
    //       return rej(err);
    //     }
    //     return res(data);
    //   });
    // })
  }

  @Get('/:redeId')
  async findXMLbyRedeId(
    @Param('redeId') redeId: string,
  ): Promise<ProductStore> {
    this.logger.debug('findXMLbyRedeId');
    return this.appService.xmlGeneratorProductsByRedeId(redeId);
  }
}
