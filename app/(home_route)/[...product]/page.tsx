import ProductView from "@/app/components/ProductView";
import startDb from "@/app/lib/db";
import ProductModel from "@models/productModel";
import { isValidObjectId } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { product: string[] };
}

const fetchOneProduct = async (productId: string) => {
  if (!isValidObjectId(productId)) return redirect("/404");
  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  const finalProducts = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    bulletPoints: product.bulletPoints,
    category: product.category,
    thumbnail: product.thumbnail.url,
    images: product.images?.map((image) => image.url),
    price: product.price,
    sale: product.sale,
  };

  return JSON.stringify(finalProducts);
};

export default async function ProductPage({ params }: Props) {
  const { product } = params;
  const productId = product[1];
  const productInfo = JSON.parse(await fetchOneProduct(productId));

  let productImages = [productInfo.thumbnail];
  if (productInfo.images) {
    productImages = productImages.concat(productInfo.images);
  }

  return (
    <div className="p-4">
      <ProductView
        title={productInfo.title}
        description={productInfo.description}
        images={productImages}
        points={productInfo.bulletPoints}
        price={productInfo.price}
        sale={productInfo.sale}
      />
      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg text-blue-gray-600 font-semibold mb-2">
            상품후기
          </h1>
          <Link href={`/add-review/${productInfo.id}`}>
            <p className=" text-blue-gray-600 ">후기쓰기</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
