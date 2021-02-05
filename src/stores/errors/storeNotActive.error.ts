export class StoreNotActive extends Error {
  constructor(storeId: number) {
    super(`Essa loja com o id ${storeId} não se encontra ativa`);
  }
}
