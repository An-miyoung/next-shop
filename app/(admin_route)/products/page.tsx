import startDb from "@lib/db";
import ProductTable from "@components/ProductTable";
import React from "react";
import ProductModel from "@models/ProductModel";
import { Product } from "@app/types";

const fetchProducts = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  const skipCount = (pageNo - 1) * perPage;
  await startDb();
  const res = await ProductModel.find()
    .sort("-createdAt")
    .skip(skipCount)
    .limit(perPage);

  const products = res.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      description: product.description,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });

  return products;
};

export default async function Products() {
  const products = await fetchProducts(1, 10);
  return (
    <ProductTable
      products={products}
      currentPageNo={10}
      hasMore={false}
      showPageNavigator={true}
    />
  );
}
