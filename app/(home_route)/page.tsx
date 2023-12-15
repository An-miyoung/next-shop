import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";

interface FetchedProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: { base: number; discounted: number };
  sale: number;
}

const fetchLatestProducts = async () => {
  try {
    await startDb();
    const products = await ProductModel.find().sort("-createdAt").limit(20);

    const finalProducts = products.map((product) => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
    }));

    return JSON.stringify(finalProducts);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`상품목록을 읽어오는데 실패했습니다. ${error.message}`);
  }
};

export default async function Home() {
  const products: FetchedProduct[] = JSON.parse(await fetchLatestProducts());

  return (
    <div>
      <GridView>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </GridView>
    </div>
  );
}
