// import { Body, Controller, Get, Logger } from '@nestjs/common';
// import { AppService } from './products.service';
// import { ApiTags } from '@nestjs/swagger';
// import { FileUploadService } from './fileUpload.service';

// @ApiTags('XML - generator')
// @Controller('products')
// export class AppController {
//   constructor(
//     private readonly appService: AppService,
//     private readonly fileUploadService: FileUploadService,
//   ) {}
//   private readonly logger = new Logger(AppController.name);

//   @Get()
//   async findXmlByAllStores(@Body() storeInfos): Promise<any> {
//     this.logger.debug('findXmlByAllStores');

//     const timer = setInterval(() => {
//       console.log(
//         `Memory Usage: setInterval MB`,
//         (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
//       );
//     }, 500);

//     const productsXml = await this.appService.xmlGeneratorProductsAllStores(
//       storeInfos,
//     );

//     clearInterval(timer);

//     return this.fileUploadService.uploadXml(productsXml, storeInfos.id);
//   }
// }
