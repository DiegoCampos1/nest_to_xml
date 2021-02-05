import { BadRequestException } from '@nestjs/common';

export class ProductNotFound extends BadRequestException {
  constructor(storeId: number) {
    super(`Não existe produtos para essa loja com o id: ${storeId}`);
  }
}
