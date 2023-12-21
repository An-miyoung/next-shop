// checkout/route.ts 내에서는 checkout session 을 create 할뿐, order객체를 동시에 만들수 없어서
// Stripe 가 제공하는 webhook 의 event 에 따라 checkout.session.completed 이면 order를 생성

import { getCartItems } from "@/app/lib/cartHelper";
import startDb from "@/app/lib/db";
import OrderModel from "@/app/models/orderModel";
import { stripeCustomer } from "@app/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const POST = async (req: Request) => {
  const data = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      data,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 400 }
    );
  }

  // event 종류가 많으면 switch case 로 사용
  if (event.type === "checkout.session.completed") {
    // stripeSession.customer 는 string | Stripe.Customer | Stripe.DeletedCustomer | null형태이므로
    // customer 를 string 형태로 재선언해 오류를 제거
    // customer 를 이용해 order 를 만들기 위해 type을 선언해 준다.(console 로 찍어본 후 집어넣는 형식)
    const stripeSession = event.data.object as unknown as {
      customer: string;
      payment_intent: string;
      payment_status: string;
      amount_subtotal: number;
      customer_details: {
        address: any;
        email: string;
        name: string;
      };
    };
    const customer = (await stripe.customers.retrieve(
      stripeSession?.customer
    )) as unknown as stripeCustomer;

    const {
      metadata: { userId, cartId, type },
    } = customer;
    // 새로운 order 객체를 DB에 만듬
    if (type === "checkout") {
      const cartItems = await getCartItems(userId, cartId);

      await startDb();
      await OrderModel.create({
        userId,
        stripeCustomerId: stripeSession.customer,
        paymentIntent: stripeSession.payment_intent,
        totalAmount: stripeSession.amount_subtotal,
        shippingDetails: {
          address: stripeSession.customer_details,
          email: stripeSession.customer_details.email,
          name: stripeSession.customer_details.name,
        },
        paymentStatus: stripeSession.payment_status,
        deliveredStatus: "ordered",
        orderItems: cartItems.products,
      });
    }
    // 재고계산
  }

  return NextResponse.json({}, { status: 200 });
};
