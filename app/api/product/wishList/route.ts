import startDb from "@lib/db";
import WishlistModel from "@models/wishListModel";
import { authConfig } from "@/auth";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user)
      return NextResponse.json(
        {
          error: "로그인해야 접근할 수 있는 메뉴입니다.",
        },
        { status: 403 }
      );

    const { productId } = await req.json();
    if (!isValidObjectId(productId))
      return NextResponse.json(
        {
          error: "상품정보가 올바르지 않아 찜하기에 실패했습니다.",
        },
        { status: 422 }
      );

    await startDb();
    const wishList = await WishlistModel.findOne({
      user: session.user.id,
      products: productId,
    });

    if (wishList) {
      await WishlistModel.findByIdAndUpdate(wishList._id, {
        $pull: { products: productId },
      });
    } else {
      await WishlistModel.findOneAndUpdate(
        { user: session.user.id },
        { user: session.user.id, $push: { products: productId } },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    NextResponse.json(
      {
        error: "찜하기에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
