export class StoreNotOwnPlataform extends Error {
  constructor(storeId: number) {
    super(`Essa loja com o id ${storeId} não é da plataforma smart`);
  }
}
