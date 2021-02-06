import { BadRequestException } from '@nestjs/common';

export class StoreNotOwnPlataform extends BadRequestException {
  constructor(storeId: number) {
    super(`A loja: ${storeId} não é da plataforma smart`);
  }
}
