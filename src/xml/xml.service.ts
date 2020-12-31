import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as builder from 'xmlbuilder';
import { Product } from './interfaces/interface';
import { ProductStore } from './productStore.entity';
import { StoreProps } from 'src/stores/interfaces/store';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductStore)
    private readonly productStoreRepository,
  ) {}

  async xmlItemByStoreId(storeId: string | number): Promise<any> {
    const qb = await this.productStoreRepository
      .createQueryBuilder('ps')
      .innerJoin('stores', 's', 'ps.store_id = s.id')
      .innerJoin('ps.product', 'p')
      .leftJoin(
        'exclusive_price',
        'ep',
        '(p.id = ANY(ep.products_id) AND ep.store_id = ps.store_id AND ep.status = 1 AND ((CURRENT_TIMESTAMP BETWEEN ep.initial_date AND ep.end_date) OR (ep.initial_date IS NULL OR ep.end_date IS NULL)))',
      )
      .select('ps.id', 'id')
      .addSelect('ps.stock', 'stock')
      .addSelect('p.image', 'image')
      .addSelect('s.url', 'urlStore')
      .addSelect('s.type', 'typeStore')
      .addSelect(
        '(CASE WHEN (EXISTS (SELECT 1 FROM exclusive_price AS ep WHERE p.id = ANY(ep.products_id) AND (ep.value IS NULL OR ep.promotion_value < ep.value) AND ep.status = 1 AND ep.store_id = ps.store_id AND (CURRENT_TIMESTAMP BETWEEN ep.initial_date AND ep.end_date OR (ep.initial_date IS NULL OR ep.end_date IS NULL)))) THEN TRUE ELSE ps.promotion END)',
        'promotion',
      )
      .addSelect(
        '(CASE WHEN (EXISTS (SELECT 1 FROM exclusive_price AS ep WHERE p.id = ANY(ep.products_id) AND (ep.value IS NULL OR ep.promotion_value < ep.value) AND ep.status = 1 AND ep.store_id = ps.store_id AND (CURRENT_TIMESTAMP BETWEEN ep.initial_date AND ep.end_date OR (ep.initial_date IS NULL OR ep.end_date IS NULL)))) THEN 1 ELSE 0 END)',
        'exclusivePrice',
      )
      .addSelect(
        'COALESCE((SELECT SUM(ol.order_limit) FROM order_limit AS ol INNER JOIN order_limit_product AS olp ON (ol.id = olp.order_limit_id AND (p.id = olp.product_id)) WHERE ol.status = 1 AND olp.status = 1 AND ol.store_id = s.id AND ((CURRENT_TIMESTAMP BETWEEN ol.initial_date AND ol.end_date) OR (ol.initial_date IS NULL OR ol.end_date IS NULL) )), 0)',
        'orderLimit',
      )
      .addSelect('COALESCE(ep.value, ps.price)', 'price')
      .addSelect(
        'COALESCE(ep.promotion_value, ps.pricePromotion)',
        'pricePromotion',
      )
      .addSelect('p.id', 'productId')
      .addSelect('p.name', 'productName')
      .addSelect('p.defaultDescription', 'defaultDescription')
      .addSelect('p.codeProduct', 'codeProduct')
      .addSelect('p.nomseccsm', 'nomseccsm')
      .addSelect('p.desctgcsm', 'desctgcsm')
      .addSelect('p.dessubctgprdcsm', 'dessubctgprdcsm')
      .addSelect('p.ean', 'ean')
      .addSelect('p.desmrcctl', 'desmrcctl')
      .addSelect('p.image', 'image')
      .addSelect(
        '(CASE WHEN (EXISTS (SELECT 1 FROM exception_products ep2 INNER JOIN stock_exception AS se ON (se.id = ep2.stock_exception_id) WHERE ((p.id = ANY("ep2"."products_id")) OR (p.id = ep2.product_id) OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND p."CODSUBCTGCSM" = ep2."CODSUBCTGCSM") OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND ep2."CODSUBCTGCSM" IS NULL) OR (p."CODSECCSM" = ep2."CODSECCSM" AND ep2."CODCTGCSM" IS NULL AND ep2."CODSUBCTGCSM" IS NULL)) AND ep2.status = 1 AND se.status = 1 AND se.store_id = s.id )) THEN 1 ELSE 0 END)',
        'ignoreStock',
      )
      .addSelect('ps.rupture', 'rupture')
      .addSelect('ps.indaltetq', 'indaltetq')
      .addSelect('ps.ctr', 'ctr')
      .addSelect('ps.desprdloja', 'desprdloja')
      .andWhere('ps.store_id = :storeId', { storeId })
      .andWhere('ps.status = 1')
      .andWhere('s.type = 1')
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM blacklist_product AS bp WHERE bp.store_id = ps.store_id AND (p.id = ANY(bp.products_id) OR (p."CODSECCSM" = bp.code_session  AND p."CODCTGCSM" = bp.code_category AND p."CODSUBCTGCSM" = bp.code_subcategory) OR (p."CODSECCSM" = bp.code_session AND p."CODCTGCSM" = bp.code_category AND bp.code_subcategory IS NULL) OR (p."CODSECCSM" = bp.code_session AND bp.code_category IS NULL AND bp.code_subcategory IS NULL)) AND bp.status = 1 AND (CURRENT_TIMESTAMP BETWEEN bp.start_date AND bp.end_date OR bp.start_date IS NULL))',
      )
      // A ordenação está identica a ordenação dos produtops em nosso site, mas caso a mesma não seja necessária podemos remover da linha 87 a 97:
      .orderBy('p.name', 'ASC')
      .addOrderBy(
        '(CASE WHEN "p"."image" = 1 AND "ps"."rupture" = 0 AND ("ps"."stock" > 0 OR "ps"."indaltetq" = 1 OR (CASE WHEN (EXISTS (SELECT 1 FROM exception_products ep2 INNER JOIN stock_exception AS se ON (se.id = ep2.stock_exception_id) WHERE (("p"."id" = ANY("ep2"."products_id")) OR ("p"."id" = ep2.product_id) OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND p."CODSUBCTGCSM" = ep2."CODSUBCTGCSM") OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND ep2."CODSUBCTGCSM" IS NULL) OR (p."CODSECCSM" = ep2."CODSECCSM" AND ep2."CODCTGCSM" IS NULL AND ep2."CODSUBCTGCSM" IS NULL)) AND ep2.status = 1 AND se.status = 1 AND se.store_id = "s"."id" )) THEN 1 ELSE 0 END) = 1) THEN 1 ELSE 0 END)',
        'DESC',
      )
      .addOrderBy(
        '(CASE WHEN "ps"."rupture" = 0 AND ("ps"."stock" > 0 OR "ps"."indaltetq" = 1 OR (CASE WHEN (EXISTS (SELECT 1 FROM exception_products ep2 INNER JOIN stock_exception AS se ON (se.id = ep2.stock_exception_id) WHERE (("p"."id" = ANY("ep2"."products_id")) OR ("p"."id" = ep2.product_id) OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND p."CODSUBCTGCSM" = ep2."CODSUBCTGCSM") OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND ep2."CODSUBCTGCSM" IS NULL) OR (p."CODSECCSM" = ep2."CODSECCSM" AND ep2."CODCTGCSM" IS NULL AND ep2."CODSUBCTGCSM" IS NULL)) AND ep2.status = 1 AND se.status = 1 AND se.store_id = "s"."id" )) THEN 1 ELSE 0 END) = 1) THEN 1 ELSE 0 END)',
        'DESC',
      )
      .addOrderBy('p.image', 'DESC')
      .addOrderBy('ps.ctr', 'DESC');

    const data = await qb.getRawMany();

    const productAvaibleStock = (
      rupture: number,
      stock: string,
      ignoreStock: number,
      indaltetq: number,
      id: number,
    ): string => {
      const avaible = !!(
        !rupture &&
        (Number(stock) > 0 || ignoreStock || indaltetq) &&
        id
      );
      return avaible ? 'in stock' : 'out of stock';
    };

    const productImageAvaible = (productImage: number, codeProduct: string) =>
      productImage
        ? `https://imgprd.smartsupermercados.com.br/products/${codeProduct}/01_${codeProduct}_01.jpg`
        : `http://redesmart-source.s3.amazonaws.com/no-image.svg`;

    const productAvaiblePromotion = (promotion: boolean) =>
      promotion ? 'Promoção' : 'Sem promoção';

    const productXmlItem = data.map((product: Product) => {
      const itemProduct = {
        'g:item_group_id': `${product.id}`,
        'g:id': `${product.id}`,
        title: `${product.productName}`,
        description: `${product.desprdloja ?? product.defaultDescription}`,
        'g:google_product_category': `${product.nomseccsm} > ${product.desctgcsm}`,
        'g:product_type': `${product.nomseccsm} > ${product.desctgcsm} > ${product.dessubctgprdcsm}`,
        link: `https://loja.smartsupermercados.com.br${product.urlStore}/produto/${product.codeProduct}`,
        'g:image_link': `${productImageAvaible(
          product.image,
          product.codeProduct,
        )}`,
        'g:availability': `${productAvaibleStock(
          product.rupture,
          product.stock,
          product.ignoreStock,
          product.indaltetq,
          product.id,
        )}`,
        'g:sale_price': `${product.price} BRL`,
        'g:price': `${product.pricePromotion} BRL`,
        'g:gtin': `${product.ean}`,
        'g:brand': `${product.desmrcctl}`,
        'c:tags': {
          'c:tag': `${productAvaiblePromotion(product.promotion)}`,
        },
      };
      return itemProduct;
    });
    return productXmlItem;
  }

  async xmlGeneratorProductsByRedeId(storeId: string): Promise<any> {
    const qb = await this.productStoreRepository
      .createQueryBuilder('ps')
      .innerJoin('stores', 's', 'ps.store_id = s.id')
      .innerJoin('ps.product', 'p')
      .leftJoin(
        'exclusive_price',
        'ep',
        '(p.id = ANY(ep.products_id) AND ep.store_id = ps.store_id AND ep.status = 1 AND ((CURRENT_TIMESTAMP BETWEEN ep.initial_date AND ep.end_date) OR (ep.initial_date IS NULL OR ep.end_date IS NULL)))',
      )
      .select('ps.id', 'id')
      .addSelect('ps.stock', 'stock')
      .addSelect('p.image', 'image')
      .addSelect('s.url', 'urlStore')
      .addSelect('s.type', 'typeStore')
      .addSelect(
        '(CASE WHEN (EXISTS (SELECT 1 FROM exclusive_price AS ep WHERE p.id = ANY(ep.products_id) AND (ep.value IS NULL OR ep.promotion_value < ep.value) AND ep.status = 1 AND ep.store_id = ps.store_id AND (CURRENT_TIMESTAMP BETWEEN ep.initial_date AND ep.end_date OR (ep.initial_date IS NULL OR ep.end_date IS NULL)))) THEN TRUE ELSE ps.promotion END)',
        'promotion',
      )
      .addSelect(
        '(CASE WHEN (EXISTS (SELECT 1 FROM exclusive_price AS ep WHERE p.id = ANY(ep.products_id) AND (ep.value IS NULL OR ep.promotion_value < ep.value) AND ep.status = 1 AND ep.store_id = ps.store_id AND (CURRENT_TIMESTAMP BETWEEN ep.initial_date AND ep.end_date OR (ep.initial_date IS NULL OR ep.end_date IS NULL)))) THEN 1 ELSE 0 END)',
        'exclusivePrice',
      )
      .addSelect(
        'COALESCE((SELECT SUM(ol.order_limit) FROM order_limit AS ol INNER JOIN order_limit_product AS olp ON (ol.id = olp.order_limit_id AND (p.id = olp.product_id)) WHERE ol.status = 1 AND olp.status = 1 AND ol.store_id = s.id AND ((CURRENT_TIMESTAMP BETWEEN ol.initial_date AND ol.end_date) OR (ol.initial_date IS NULL OR ol.end_date IS NULL) )), 0)',
        'orderLimit',
      )
      .addSelect('COALESCE(ep.value, ps.price)', 'price')
      .addSelect(
        'COALESCE(ep.promotion_value, ps.pricePromotion)',
        'pricePromotion',
      )
      .addSelect('p.id', 'productId')
      .addSelect('p.name', 'productName')
      .addSelect('p.defaultDescription', 'defaultDescription')
      .addSelect('p.codeProduct', 'codeProduct')
      .addSelect('p.nomseccsm', 'nomseccsm')
      .addSelect('p.desctgcsm', 'desctgcsm')
      .addSelect('p.dessubctgprdcsm', 'dessubctgprdcsm')
      .addSelect('p.ean', 'ean')
      .addSelect('p.desmrcctl', 'desmrcctl')
      .addSelect('p.image', 'image')
      .addSelect(
        '(CASE WHEN (EXISTS (SELECT 1 FROM exception_products ep2 INNER JOIN stock_exception AS se ON (se.id = ep2.stock_exception_id) WHERE ((p.id = ANY("ep2"."products_id")) OR (p.id = ep2.product_id) OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND p."CODSUBCTGCSM" = ep2."CODSUBCTGCSM") OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND ep2."CODSUBCTGCSM" IS NULL) OR (p."CODSECCSM" = ep2."CODSECCSM" AND ep2."CODCTGCSM" IS NULL AND ep2."CODSUBCTGCSM" IS NULL)) AND ep2.status = 1 AND se.status = 1 AND se.store_id = s.id )) THEN 1 ELSE 0 END)',
        'ignoreStock',
      )
      .addSelect('ps.rupture', 'rupture')
      .addSelect('ps.indaltetq', 'indaltetq')
      .addSelect('ps.ctr', 'ctr')
      .addSelect('ps.desprdloja', 'desprdloja')
      .andWhere('ps.store_id = :storeId', { storeId })
      .andWhere('ps.status = 1')
      .andWhere('s.type = 1')
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM blacklist_product AS bp WHERE bp.store_id = ps.store_id AND (p.id = ANY(bp.products_id) OR (p."CODSECCSM" = bp.code_session  AND p."CODCTGCSM" = bp.code_category AND p."CODSUBCTGCSM" = bp.code_subcategory) OR (p."CODSECCSM" = bp.code_session AND p."CODCTGCSM" = bp.code_category AND bp.code_subcategory IS NULL) OR (p."CODSECCSM" = bp.code_session AND bp.code_category IS NULL AND bp.code_subcategory IS NULL)) AND bp.status = 1 AND (CURRENT_TIMESTAMP BETWEEN bp.start_date AND bp.end_date OR bp.start_date IS NULL))',
      )
      // A ordenação está identica a ordenação dos produtops em nosso site, mas caso a mesma não seja necessária podemos remover da linha 87 a 97:
      .orderBy('p.name', 'ASC')
      .addOrderBy(
        '(CASE WHEN "p"."image" = 1 AND "ps"."rupture" = 0 AND ("ps"."stock" > 0 OR "ps"."indaltetq" = 1 OR (CASE WHEN (EXISTS (SELECT 1 FROM exception_products ep2 INNER JOIN stock_exception AS se ON (se.id = ep2.stock_exception_id) WHERE (("p"."id" = ANY("ep2"."products_id")) OR ("p"."id" = ep2.product_id) OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND p."CODSUBCTGCSM" = ep2."CODSUBCTGCSM") OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND ep2."CODSUBCTGCSM" IS NULL) OR (p."CODSECCSM" = ep2."CODSECCSM" AND ep2."CODCTGCSM" IS NULL AND ep2."CODSUBCTGCSM" IS NULL)) AND ep2.status = 1 AND se.status = 1 AND se.store_id = "s"."id" )) THEN 1 ELSE 0 END) = 1) THEN 1 ELSE 0 END)',
        'DESC',
      )
      .addOrderBy(
        '(CASE WHEN "ps"."rupture" = 0 AND ("ps"."stock" > 0 OR "ps"."indaltetq" = 1 OR (CASE WHEN (EXISTS (SELECT 1 FROM exception_products ep2 INNER JOIN stock_exception AS se ON (se.id = ep2.stock_exception_id) WHERE (("p"."id" = ANY("ep2"."products_id")) OR ("p"."id" = ep2.product_id) OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND p."CODSUBCTGCSM" = ep2."CODSUBCTGCSM") OR (p."CODSECCSM" = ep2."CODSECCSM" AND p."CODCTGCSM" = ep2."CODCTGCSM" AND ep2."CODSUBCTGCSM" IS NULL) OR (p."CODSECCSM" = ep2."CODSECCSM" AND ep2."CODCTGCSM" IS NULL AND ep2."CODSUBCTGCSM" IS NULL)) AND ep2.status = 1 AND se.status = 1 AND se.store_id = "s"."id" )) THEN 1 ELSE 0 END) = 1) THEN 1 ELSE 0 END)',
        'DESC',
      )
      .addOrderBy('p.image', 'DESC')
      .addOrderBy('ps.ctr', 'DESC');

    const data = await qb.getRawMany();

    const productAvaibleStock = (
      rupture: number,
      stock: string,
      ignoreStock: number,
      indaltetq: number,
      id: number,
    ): string => {
      const avaible = !!(
        !rupture &&
        (Number(stock) > 0 || ignoreStock || indaltetq) &&
        id
      );
      return avaible ? 'in stock' : 'out of stock';
    };

    const productImageAvaible = (productImage: number, codeProduct: string) =>
      productImage
        ? `https://imgprd.smartsupermercados.com.br/products/${codeProduct}/01_${codeProduct}_01.jpg`
        : `http://redesmart-source.s3.amazonaws.com/no-image.svg`;

    const productAvaiblePromotion = (promotion: boolean) =>
      promotion ? 'Promoção' : 'Sem promoção';

    const productXmlItem = data.map((product: Product) => {
      const itemProduct = {
        'g:item_group_id': `${product.id}`,
        'g:id': `${product.id}`,
        title: `${product.productName}`,
        description: `${product.desprdloja ?? product.defaultDescription}`,
        'g:google_product_category': `${product.nomseccsm} > ${product.desctgcsm}`,
        'g:product_type': `${product.nomseccsm} > ${product.desctgcsm} > ${product.dessubctgprdcsm}`,
        link: `https://loja.smartsupermercados.com.br${product.urlStore}/produto/${product.codeProduct}`,
        'g:image_link': `${productImageAvaible(
          product.image,
          product.codeProduct,
        )}`,
        'g:availability': `${productAvaibleStock(
          product.rupture,
          product.stock,
          product.ignoreStock,
          product.indaltetq,
          product.id,
        )}`,
        'g:sale_price': `${product.price} BRL`,
        'g:price': `${product.pricePromotion} BRL`,
        'g:gtin': `${product.ean}`,
        'g:brand': `${product.desmrcctl}`,
        'c:tags': {
          'c:tag': `${productAvaiblePromotion(product.promotion)}`,
        },
      };
      return itemProduct;
    });

    const xmlProductsStore = {
      rss: {
        '@xmlns:g': 'http://base.google.com/ns/1.0',
        '@version': '2.0',
        chanel: {
          title: 'Martins store products',
          link: `https://loja.smartsupermercados.com.br${data[0].urlStore}`,
          description: 'This is a Feed with recommended fields',
          SecretKey: 'YSu8akvfLowFlWDm7phh1Q==',
          Apikey: 'smartsupermercados',
          item: productXmlItem,
        },
      },
    };

    const feed = builder.create(xmlProductsStore, {
      encoding: 'utf-8',
      standalone: true,
    });

    return feed.end({ pretty: true });
  }

  async xmlGeneratorProductsAllStores(stores: StoreProps[]): Promise<any> {
    const subChanells = Promise.all(
      stores.map(async (store) => {
        const SalesChannel = {
          title: `${store.name}`,
          link: `https://loja.smartsupermercados.com.br${store.url}`,
          description: 'This is a Feed with recommended fields',
          item: await this.xmlItemByStoreId(store.id),
        };
        return SalesChannel;
      }),
    );

    const xmlProductsStore = {
      rss: {
        '@xmlns:g': 'http://base.google.com/ns/1.0',
        '@version': '2.0',
        chanel: {
          title: 'Martins store products',
          link: `https://loja.smartsupermercados.com.br`,
          description: 'This is a Feed with recommended fields',
          SecretKey: 'YSu8akvfLowFlWDm7phh1Q==',
          Apikey: 'smartsupermercados',
          SalesChannel: await subChanells,
        },
      },
    };

    const feed = builder.create(xmlProductsStore, {
      encoding: 'utf-8',
      standalone: true,
    });

    return feed.end({ pretty: true });
  }
}
