export class StoreNotFound extends Error {
  constructor(storeId: number) {
    super(`Nenhuma loja encontrada com esse id: ${storeId}.`);
  }
}
