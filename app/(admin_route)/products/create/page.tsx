"use client";

import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import { newProductInfoSchema } from "@utils/validationSchema";
import React from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";

export default function Create() {
  const handlCreateProduct = async (values: NewProductInfo) => {
    try {
      console.log("validattion start");
      // abortEarly: false 로 하면 모든 검사를 끝낸 후 마지막에 에러를 표시
      await newProductInfoSchema.validate(values, {
        abortEarly: false,
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.warning(err.message);
        });
      }
    }
  };
  return (
    <div>
      {/* ProductForm 에서 onSubmit 함수를 내려줌으로써 */}
      {/* onSubmit 함수속에  cloudinary를 handling 하는 함수를 넣어서 내려보낸다.*/}
      <ProductForm onSubmit={handlCreateProduct} />
    </div>
  );
}
