"use server";
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProductModel";
import { NewFeaturedProduct } from "@app/types";

export const createFeaturedProduct = async (info: NewFeaturedProduct) => {
  try {
    await startDb();
    await FeaturedProductModel.create({ ...info });
  } catch (error: any) {
    console.log(error.message);
    throw new Error("featured 생성에 실패했습니다.");
  }
};
