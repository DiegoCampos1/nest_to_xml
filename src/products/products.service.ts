import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as builder from 'xmlbuilder';
import { Product } from './interfaces/products';
import { ProductStore } from './productStore.entity';
import { StoreProps } from 'src/stores/interfaces/store';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductStore)
    private readonly productStoreRepository,
  ) {}

  async xmlItemByStoreId(storeId: string | number, storeName): Promise<any> {
    console.log('xmlItemByStoreId called');
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
      .addSelect('p.codundvnd', 'salesUnitCode')
      .addSelect('p.qdemnmmpl', 'multipleSale')
      .addSelect('p.desundvnd', 'salesUnit')
      .addSelect('p.conversion', 'multiple')
      .andWhere('ps.store_id = :storeId', { storeId })
      .andWhere('ps.status = 1')
      .andWhere('s.type = 1')
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM blacklist_product AS bp WHERE bp.store_id = ps.store_id AND (p.id = ANY(bp.products_id) OR (p."CODSECCSM" = bp.code_session  AND p."CODCTGCSM" = bp.code_category AND p."CODSUBCTGCSM" = bp.code_subcategory) OR (p."CODSECCSM" = bp.code_session AND p."CODCTGCSM" = bp.code_category AND bp.code_subcategory IS NULL) OR (p."CODSECCSM" = bp.code_session AND bp.code_category IS NULL AND bp.code_subcategory IS NULL)) AND bp.status = 1 AND (CURRENT_TIMESTAMP BETWEEN bp.start_date AND bp.end_date OR bp.start_date IS NULL))',
      )
      // A ordenação está identica a ordenação dos produtops em nosso site, mas caso a mesma não seja necessária podemos remover
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
        'c:specs': {
          'c:code_product': `${product.codeProduct}`,
          'c:spec_sales_unit_code': `${product.salesUnitCode}`,
          'c:spec_sales_unit': `${product.salesUnit}`,
          'c:spec_minimum_quantity_multiple': `${
            product.multipleSale ? product.multipleSale : null
          }`,
          'c:spec_conversion': `${product.multiple ? product.multiple : null}`,
        },
        'c:details': {
          'c:detail_name_store': `${storeName}`,
          'c:detail_id_store': `${storeId}`,
        },
      };
      return itemProduct;
    });
    return productXmlItem;
  }

  // Serviço criado mas sem utilidade no momento, caso tenhamos um grande numero de produtos e o arquivo gerado fique de um tamanho inviavél,
  // esse serviço gera um xml por store, recebendo como parametro o storeId:
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

      .addSelect('p.desundvnd', 'salesUnit')
      .addSelect('p.qdemnmmpl', 'multipleSale')

      .addSelect('ps.desprdloja', 'desprdloja')
      .andWhere('ps.store_id = :storeId', { storeId })
      .andWhere('ps.status = 1')
      .andWhere('s.type = 1')
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM blacklist_product AS bp WHERE bp.store_id = ps.store_id AND (p.id = ANY(bp.products_id) OR (p."CODSECCSM" = bp.code_session  AND p."CODCTGCSM" = bp.code_category AND p."CODSUBCTGCSM" = bp.code_subcategory) OR (p."CODSECCSM" = bp.code_session AND p."CODCTGCSM" = bp.code_category AND bp.code_subcategory IS NULL) OR (p."CODSECCSM" = bp.code_session AND bp.code_category IS NULL AND bp.code_subcategory IS NULL)) AND bp.status = 1 AND (CURRENT_TIMESTAMP BETWEEN bp.start_date AND bp.end_date OR bp.start_date IS NULL))',
      )
      // A ordenação está identica a ordenação dos produtos em nosso site, mas caso a mesma não seja necessária podemos remover:
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
        'c:specs': {
          'c:spec_sales_unit': `${product.salesUnit}`,
          'c:spec_multiple_sale': `${
            product.multipleSale ? product.multipleSale + ' KG' : '-'
          }`,
          'c:spec_multiple': `${product.multiple ? product.multiple : '-'}`,
        },
        'c:details': {
          'c:detail_name_store': `${data[0].urlStore}`,
          'c:detail_id_store': `${storeId}`,
        },
      };

      return itemProduct;
    });

    const xmlProductsStore = {
      rss: {
        '@xmlns:g': 'http://base.google.com/ns/1.0',
        '@xmlns:c': 'http://base.google.com/ns/1.0',
        '@version': '2.0',
        chanel: {
          title: 'Martins store products',
          link: `https://loja.smartsupermercados.com.br${data[0].urlStore}`,
          description: 'This is a Feed with recommended fields',
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

  // DEFAULT TODOS OS PRODUTOS //
  async xmlGeneratorProductsAllStores(stores: StoreProps[]): Promise<any> {
    console.log('xmlGeneratorProductsAllStores called');
    console.time('productsFromActivesStores');
    const productsFromActivesStores = Promise.all(
      stores.map(async (store: StoreProps) => {
        const items = await this.xmlItemByStoreId(store.id, store.name);
        console.log(
          `Memory Usage: Map productsFromActivesStores MB`,
          (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
        );
        return items;
      }),
    );
    console.log(
      `Memory Usage: productsFromActivesStores MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    console.timeEnd('productsFromActivesStores');

    console.time('xmlProductsStore');
    const xmlProductsStore = {
      rss: {
        '@xmlns:g': 'http://base.google.com/ns/1.0',
        '@xmlns:c': 'http://base.google.com/ns/1.0',
        '@version': '2.0',
        item: await productsFromActivesStores,
      },
    };
    console.log(
      `Memory Usage: xmlProductsStore MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    console.timeEnd('xmlProductsStore');

    // const filePath = path.resolve(__dirname, './xmlAllProducts');
    // console.log('filePath', filePath);
    // const stream = fs.createWriteStream(filePath);

    // stream.once('open', function (fd) {
    //   builder
    //     .begin(function (chunk) {
    //       stream.write(chunk);
    //     })
    //     .dec('1.0', 'utf-8', true)
    //     //.ele('xmlbuilder')
    //     .ele(xmlProductsStore)
    //     //.up()
    //     .end();
    //   stream.end();
    // });
    console.time('feed');

    const feed = builder.create(xmlProductsStore, {
      encoding: 'utf-8',
      standalone: true,
    });

    console.log(
      `Memory Usage: feed MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    console.timeEnd('feed');

    console.log('feedEndPretty');
    console.time('feedEndPretty');
    const feedEndPretty = feed.end({ pretty: false });
    console.log(
      `Memory Usage: feedEndPretty MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    console.timeEnd('feedEndPretty');

    return feedEndPretty;
  }
}
