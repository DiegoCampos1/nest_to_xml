import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Product } from './product.entity';
import { Store } from './store.entity';

export enum Rupture {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum Status {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

@Entity({ name: 'product_store' })
@Unique('product_store__store_id__product_id__unique_constraint', [
  'productId',
  'storeId',
])
export class ProductStore extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'code_product_store', default: '' })
  codeProductStore: string;

  @Column({
    name: 'stock',
    type: 'decimal',
    precision: 13,
    scale: 3,
    default: 0,
  })
  public stock: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column()
  promotion: boolean;

  @Column({
    name: 'price_promotion',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  pricePromotion: number;

  @Column()
  blacklist: boolean;

  @Column()
  rupture: Rupture;

  @Column({ default: 0 })
  indaltetq: Rupture;

  @Column({ name: 'ignore_stock' })
  ignoreStock: boolean;

  @Column({
    type: 'decimal',
    name: 'order_limit',
    precision: 13,
    scale: 3,
    default: 0,
  })
  orderLimit: number;

  @Column()
  delivery: boolean;

  @Column({ name: 'created_date', type: 'timestamp', default: new Date() })
  createdDate: Date;

  @Column({
    name: 'updated_date',
    type: 'timestamp',
    nullable: true,
    default: new Date(),
  })
  updatedDate: Date;

  @Column({
    name: 'updated_price_date',
    type: 'timestamp',
    nullable: true,
    default: new Date(),
  })
  updatedPriceDate: Date;

  @Column({ default: 0 })
  ctr: number;

  @Column()
  status: Status;

  @Column({ name: 'desprdloja', length: 255, nullable: true })
  desprdloja: string;

  @ManyToOne(() => Product, (product) => product.productStore)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Store, (store) => store.productStore)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
