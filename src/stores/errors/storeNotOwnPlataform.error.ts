import { BadRequestException } from '@nestjs/common';

export class StoreNotOwnPlataform extends BadRequestException {
  constructor(storeId: number) {
    super(`Essa loja com o id ${storeId} não é da plataforma smart`);
  }
}
