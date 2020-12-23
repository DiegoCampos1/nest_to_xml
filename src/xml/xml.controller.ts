import { Controller, Get, Logger, Param } from '@nestjs/common';
import { AppService } from './xml.service';
import { ProductStore } from './productStore.entity';

@Controller('xml')
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Get('/:redeId')
  async findXMLbyRedeId(
    @Param('redeId') redeId: string,
  ): Promise<ProductStore> {
    this.logger.debug('findXMLbyRedeId');
    return this.appService.xmlGeneratorProductsByRedeId(redeId);
  }
}
