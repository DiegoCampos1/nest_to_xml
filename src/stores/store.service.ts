import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../products/store.entity';
import { StoreProps } from './interfaces/store';
import { StoreNotFound } from './errors/storeNotFound.error';
import { StoreNotActive } from './errors/storeNotActive.error';
import { StoreNotOwnPlataform } from './errors/storeNotOwnPlataform.error';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository,
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

  async generateXmlById(idStore): Promise<StoreProps[]> {
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

    console.log(store);
    return idStore;
  }
}
