import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

// import { Rede } from '../user/rede.entity';
// import { Rules } from './rules/rules.entity';
// import { Contact } from './contact/contact.entity';
// import { PaymentStore } from './payment/paymentStore.entity';
// import { Restrictions } from './restriction/restriction.entity';
// import { BlacklistProduct } from './product/blacklistProduct/blacklistProduct.entity';
// import { OrderLimit } from './product/productStore/orderLimit/orderLimit.entity';
// import { StockException } from './product/productStore/stockException/stockException.entity';
import { ProductStore } from './productStore.entity';
// import { Campaign } from '../marketing/campaign/campaign.entity';
// import { ProductShowCase } from './product/productShowCase/productShowCase.entity';
// import { ExclusivePrice } from './product/exclusivePrice/exclusivePrice.entity';
// import { Banner } from '../marketing/banner/banner.entity';
// import { ProductList } from './product/productList/productList.entity';
// import { Coupon } from '../marketing/coupon/coupon.entity';
// import { Newsletter } from './newsletter/newsletter.entity';
// import { ClientStore } from '../client/clientStore/clientStore.entity';
// import { Order } from '../order/order.entity';

export enum Status {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 4,
}

export enum Type {
  OWN = 1,
  EXTERNAL = 2,
}
@Entity({ name: 'stores' })
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 14, unique: true })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 14, unique: true })
  cnpj: string;

  @Column({ name: 'rede_id' })
  redeId: number;

  @Column({ length: 100 })
  polo: string;

  @Column({ length: 8, default: '' })
  cep: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 100 })
  neighborhood: string;

  @Column({ name: 'address_number', length: 7 })
  addressNumber: string;

  @Column({ nullable: true })
  complement: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 3 })
  state: string;

  @Column({ default: '-18.9216511', type: 'decimal', precision: 15, scale: 13 })
  lat: number;

  @Column({ default: '-48.262667', type: 'decimal', precision: 15, scale: 13 })
  lng: number;

  @Column({ nullable: true })
  logo?: string;

  @Column({ name: 'phone_number', length: 11 })
  phoneNumber: string;

  @Column({ length: 11, nullable: true })
  whatsapp?: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 255, nullable: true })
  facebook?: string;

  @Column({ length: 255, nullable: true })
  instagram?: string;

  @Column({ length: 255, nullable: true })
  youtube?: string;

  @Column({ name: 'oppening_hour', length: 255 })
  oppeningHour: string;

  @Column({ length: 100, unique: true })
  url: string;

  @Column({ name: 'activate_date', type: 'timestamp', nullable: true })
  activateDate: Date;

  @Column()
  status: Status;

  distance?: number;

  @Column({ name: 'payment_online', default: 1 })
  paymentOnline: number;

  @Column({ name: 'sync_date', nullable: true })
  syncDate: Date;

  @Column({ name: 'sync_date_started', nullable: true })
  syncDateStarted: Date;

  @Column({ name: 'type', default: 1 })
  type: Type;

  @Column({ name: 'inactivate_date', type: 'timestamp', nullable: true })
  inactivateDate: Date;

  @OneToMany(() => ProductStore, (productStore) => productStore.store)
  productStore: ProductStore[];
}
