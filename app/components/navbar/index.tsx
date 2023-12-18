import React from "react";
import NavUI from "@components/navbar/NavUI";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { redirect } from "next/navigation";
import CartModel from "@/app/models/cartModel";
import { Types } from "mongoose";

const getCartItemsCount = async () => {
  try {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("/auth/siginin");
    if (!session.user) return 0;

    const user = session?.user as {
      name: string;
      email: string;
      image: undefined;
      id: string;
      role: string;
      verified: boolean;
    };

    // user.id 는 string 이고 db 에 접근하려면 objectId 여야해서 조작한다.
    const cart = await CartModel.aggregate([
      // user 에 맞는 장바구니를 찾고
      { $match: { userId: new Types.ObjectId(user.id) } },
      // items 를 열어서 내용을 뽑아낸다.
      { $unwind: "$items" },
      // id별로 그룹화해서 quantity를 모두 더한후 totalQuantity 라는 필드에 넣어준다.
      {
        $group: {
          _id: "$_id",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    if (cart.length) {
      return cart[0].totalQuantity;
    } else return 0;
  } catch (error: any) {
    console.log(`장바구니를 읽어오는데 실패했습니다. ${error.message}`);
    return 0;
  }
};

export default async function Navbar() {
  const count = await getCartItemsCount();

  return <NavUI cartItemsCount={count} />;
}
