import startDb from "@lib/db";
import ReviewModel from "@models/reviewModel";
import { ReviewRequestBody } from "@/app/types";
import { authConfig } from "@/auth";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await getServerSession(authConfig);
  if (!session?.user)
    return NextResponse.json(
      {
        error: "로그인해야 접근할수 있는 메뉴입니다.",
      },
      { status: 401 }
    );

  const userId = session.user.id;
  const { productId, rating, comment } =
    (await req.json()) as ReviewRequestBody;
  if (!isValidObjectId(productId))
    return NextResponse.json(
      {
        error: "상품정보가 올바르지 않아 후기작성에 실패했습니다.",
      },
      { status: 401 }
    );
  if (rating <= 0 || rating > 5)
    return NextResponse.json(
      {
        error: "별점은 0이상 5미만이어야 합니다.",
      },
      { status: 401 }
    );
  const data = {
    userId,
    product: productId,
    rating,
    comment,
  };

  try {
    await startDb();
    await ReviewModel.findOneAndUpdate(
      {
        userId,
        product: productId,
      },
      data,
      {
        upsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: "후기작성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
