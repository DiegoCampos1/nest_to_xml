import { NotFoundException } from '@nestjs/common';

export class StoreNotFound extends NotFoundException {
  constructor(storeId: number) {
    super(`Nenhuma loja encontrada com esse id: ${storeId}.`);
  }
}
