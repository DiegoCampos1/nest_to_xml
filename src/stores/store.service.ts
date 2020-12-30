import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../xml/store.entity';
import { StoreProps } from './interfaces/store';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository,
  ) {}

  async storeActives(): Promise<StoreProps[]> {
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

    return data;
  }
}
