import { BadRequestException } from '@nestjs/common';

export class StoreNotActive extends BadRequestException {
  constructor(storeId: number) {
    super(`A loja: ${storeId} não se encontra ativa`);
  }
}
