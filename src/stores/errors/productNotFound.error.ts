import { BadRequestException } from '@nestjs/common';

export class ProductNotFound extends BadRequestException {
  constructor(storeId: number) {
    super(`Não existe produtos para a loja: ${storeId}`);
  }
}
