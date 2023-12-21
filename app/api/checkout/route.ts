import { getCartItems } from "@lib/cartHelper";
import { authConfig } from "@/auth";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user)
      return NextResponse.json(
        {
          error: "로그인상태일때 접근가능합니다.",
        },
        { status: 401 }
      );

    const data = await req.json();
    const cartId = data.cartId as string;
    if (!isValidObjectId(cartId))
      return NextResponse.json(
        {
          error: "식별한 정보가 없어 장바구니를 가져오는데 실패했습니다.",
        },
        { status: 401 }
      );

    // cartModel을 aggregation 하는 함수를 호출.
    const cartItems = await getCartItems(session.user.id, cartId);
    if (!cartItems)
      return NextResponse.json(
        {
          error: "장바구니를 찾는데 실패했습니다.",
        },
        { status: 404 }
      );

    // stripe payment link 에 필요한 정보를 만들어 낸다. create-> params필요-> line_items 필요
    const line_items = cartItems.products.map((product) => {
      return {
        price_data: {
          currency: "KRW",
          // 미국의 경우, 달러아래 센트까지 계산해주기 위해 price*100을 한다.
          unit_amount: product.price,
          product_data: {
            name: product.title,
            images: [product.thumbnail],
          },
        },
        quantity: product.quantity,
      };
    });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: process.env.PAYMENT_SUCCESS_URL!,
      cancel_url: process.env.PAYMENT_CANCEL_URL!,
      shipping_address_collection: { allowed_countries: ["US", "JP", "KR"] },
    };
    // stripe link
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      error: "결제에 실패했습니다.",
    });
  }
};
