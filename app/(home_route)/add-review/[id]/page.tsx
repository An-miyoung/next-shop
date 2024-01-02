import React from "react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { authConfig } from "@/auth";
import startDb from "@lib/db";
import ReviewModel from "@models/reviewModel";
import ReviewForm from "@components/ReviewForm";
import ProductModel from "@models/productModel";
import { PageNotFound } from "@components/404";

interface Props {
  params: { id: string };
}

const fetchMyReview = async (productId: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return redirect("/auth/signin");

  const userId = session.user.id;
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const reviewContent = await ReviewModel.findOne({
    userId,
    product: productId,
  }).populate<{ product: { title: string; thumbnail: { url: string } } }>({
    path: "product",
    select: "title thumbnail.url",
    model: ProductModel,
  });

  if (!reviewContent) return null;

  return {
    id: reviewContent._id.toString(),
    rating: reviewContent.rating,
    comment: reviewContent.comment,
    product: {
      title: reviewContent.product.title,
      thumbnail: reviewContent.product.thumbnail.url,
    },
  };
};

export default async function Review({ params }: Props) {
  const productId = params.id;
  if (!productId) return <PageNotFound />;

  const review = await fetchMyReview(productId);
  if (!review) return <PageNotFound />;

  const initialValue = review
    ? {
        comment: review.comment || "",
        rating: review.rating,
      }
    : undefined;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={review.product.thumbnail || ""}
          alt={review.product.title || "thumbnail"}
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
          priority
          className=" rounded"
        />
        <h3 className="font-semibold">{review.product.title}</h3>
      </div>
      <ReviewForm productId={productId} initialValue={initialValue} />
    </div>
  );
}
