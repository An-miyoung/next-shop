"use clent";

import React from "react";
import ProductForm, { InitialValue } from "@components/ProductForm";
import { NewProductInfo, ProductResponse } from "@app/types";
import { removeAndUpdateProductImages } from "../(admin_route)/products/action";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: Props) {
  const initialValue: InitialValue = {
    ...product,
    bulletPoints: product.bulletPoints || [],
    thumbnail: product.thumbnail.url,
    images: product.images?.map((image) => image.url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
  };

  const handlCreateProduct = async (values: NewProductInfo) => {
    "use server";
    const { thumbnail, images } = values;
    try {
      console.log(values);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleImageRemove = async (source: string) => {
    "use server";
    const splitSource = source.split("/");
    const publicId = splitSource[splitSource.length - 1].split(".")[0];
    await removeAndUpdateProductImages(product.id, publicId);
  };

  return (
    <ProductForm
      initialValue={initialValue}
      onSubmit={handlCreateProduct}
      onImageRemove={handleImageRemove}
    />
  );
}
