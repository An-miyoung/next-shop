import { PageNotFound } from "@/app/components/404";
import WishlistProductCard from "@/app/components/WishlistProductCard";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import WishlistModel from "@/app/models/wishListModel";
import { authConfig } from "@/auth";
import { ObjectId, isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const fetchWishlist = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return redirect("/auth/signin");

  await startDb();
  const wishlist = await WishlistModel.findOne({
    user: session.user.id,
  }).populate<{
    products: {
      _id: ObjectId;
      title: string;
      thumbnail: { url: string };
      price: { discounted: number };
    }[];
  }>({
    path: "products",
    select: "title thumbnail.url price.discounted",
    model: ProductModel,
  });

  if (!wishlist) return [];

  return wishlist.products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    thumbnail: product.thumbnail.url,
    price: product.price.discounted,
  }));
};

export default async function WishList() {
  const products = await fetchWishlist();

  if (products.length === 0)
    return (
      <div className="pt-4 md:pt-8">
        <p className=" text-center text-blue-gray-600 text-lg md:text-xl">
          찜한 상품이 없습니다.
        </p>
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-blue-gray-600 text-lg pt-4">찜한 목록</h1>
      {products.map((product) => (
        <WishlistProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
