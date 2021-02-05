import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../products/store.entity';
import { StoreProps } from './interfaces/store';
import { ProductStore } from 'src/products/productStore.entity';
import { StoreNotFound } from './errors/storeNotFound.error';
import { StoreNotActive } from './errors/storeNotActive.error';
import { StoreNotOwnPlataform } from './errors/storeNotOwnPlataform.error';
import { ProductNotFound } from './errors/productNotFound.error';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository,
    @InjectRepository(ProductStore)
    private readonly productStoreRepository,
  ) {}
  // getActiveStores
  async getActiveStores(): Promise<StoreProps[]> {
    console.log('getActiveStores called');
    console.time('storeActives');

    const qb = await this.storeRepository
      .createQueryBuilder('s')
      .select('s.id', 'id')
      .addSelect('s.name', 'name')
      .addSelect('s.url', 'url')
      .andWhere('s.status = 1')
      .andWhere('s.type = 1')
      .andWhere(
        'EXISTS (SELECT 1 FROM product_store AS ps WHERE s.id = ps.store_id )',
      )
      .orderBy('s.id', 'ASC');
    const data = await qb.getRawMany();
    console.log(
      `Memory Usage: storeActives MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    console.timeEnd('storeActives');
    return data;
  }

  async getStoreInfo(idStore: number): Promise<StoreProps> {
    const store = await this.storeRepository.findOne({
      where: {
        id: idStore,
      },
    });

    if (!store) {
      throw new StoreNotFound(idStore);
    }

    if (!store.status) {
      throw new StoreNotActive(idStore);
    }

    if (store.type !== 1) {
      throw new StoreNotOwnPlataform(idStore);
    }

    const product = await this.productStoreRepository.findOne({
      where: {
        storeId: idStore,
      },
    });

    if (!product) {
      throw new ProductNotFound(idStore);
    }

    const storeInfos = {
      id: store.id,
      name: store.name,
      url: store.url,
    };

    return storeInfos;
  }
}
