import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { ProductStore } from './productStore.entity';

export enum Image {
  NOT_EXISTS = 0,
  EXISTS = 1,
}

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'CODPRD', unique: true })
  codeProduct: string;

  @Column({ length: 255, name: 'DESPRDPAD' })
  defaultDescription: string;

  @Column({ length: 255, name: 'DESPRDRDC' })
  desprdrdc: string;

  @Column({ length: 255, name: 'DESPRDCMC' })
  desprdcmc: string;

  @Column({ type: 'text', name: 'DESAGTVNDPRD', default: '<p><br></p>' })
  pitchDescription: string;

  @Column({ type: 'text', name: 'DESFCATCNPRD', default: '<p><br></p>' })
  productSpecification: string;

  @Column({ length: 255, name: 'CODUNDVND' })
  codundvnd: string;

  @Column({ length: 255, name: 'DESUNDVND' })
  desundvnd: string;

  @Column({ length: 255, name: 'QDEUNDVNDMER' })
  qdeundvndmer: string;

  @Column({ name: 'CODSECCSM' })
  codseccsm: number;

  @Column({ length: 255, name: 'NOMSECCSM' })
  nomseccsm: string;

  @Column({ name: 'CODCTGCSM' })
  codctgcsm: number;

  @Column({ length: 255, name: 'DESCTGCSM' })
  desctgcsm: string;

  @Column({ name: 'CODSUBCTGCSM' })
  codsubctgcsm: number;

  @Column({ length: 255, name: 'DESSUBCTGPRDCSM' })
  dessubctgprdcsm: string;

  @Column({ length: 255, name: 'CODBRRUNDVNDCSM' })
  ean: string;

  @Column({ name: 'MULTIPLO', nullable: true })
  conversion: number;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 3,
    default: 0,
    name: 'QDEMNMMPL',
    nullable: true,
  })
  qdemnmmpl: number;

  @Column({ length: 255, name: 'DESMRCCTL', nullable: true })
  desmrcctl: string;

  @Column({ length: 255, name: 'CODMRCCTL', nullable: true })
  codmrcctl: string;

  @Column({ length: 255, name: 'RAZSOCFRN', nullable: true })
  supplierName: string;

  @Column({ name: 'INDOBSCMPCLI', nullable: true })
  indObs?: number;

  @Column({ default: 0 })
  image: Image;

  @OneToMany(() => ProductStore, (productStore) => productStore.product)
  productStore: ProductStore[];
}
