import { BadRequestException } from '@nestjs/common';

export class StoreNotActive extends BadRequestException {
  constructor(storeId: number) {
    super(`Essa loja com o id ${storeId} não se encontra ativa`);
  }
}
