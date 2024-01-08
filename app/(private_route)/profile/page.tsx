import ProfileForm from "@components/ProfileForm";
import React from "react";
import EmailVerificationBanner from "@components/EmailVerificationBanner";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import OrderModel from "@models/orderModel";
import OrderListPublic, { Orders } from "@components/OrderListPublic";
import { PageNotFound } from "@components/404";
import { isValidObjectId } from "mongoose";

export const fetchUserProfile = async () => {
  const session = await getServerSession(authConfig);
  if (!session) return null;
  if (!session.user) return null;

  await startDb();

  if (!isValidObjectId(session.user.id)) {
    const values = {
      name: session.user.name || "네이버회원",
      email: session.user.email,
      avatar: { id: undefined, url: session.user.image },
      verified: true,
      role: "user",
      password: "0000000",
      socialId: session.user.id,
    };

    const user = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      {
        ...values,
      },
      { upsert: true }
    );

    if (!user) return null;
    return {
      id: user?._id.toString(),
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar?.url,
      verified: user?.verified,
      socialId: user?.socialId,
    };
  } else {
    const user = await UserModel.findById(session.user.id);
    if (!user) return null;
    return {
      id: user?._id.toString(),
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar?.url,
      verified: user?.verified,
    };
  }
};

const fetchLatestOrders = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return null;

  const email = session.user.email;
  await startDb();
  const orders = await OrderModel.find({ email }).sort("-createdAt").limit(1);
  if (!orders) return null;

  // object 가 1개인 [] 가 return 됨으로 map 을 돌아야 한다.
  const result: Orders[] = orders.map((order) => ({
    id: order._id.toString(),
    paymentStatus: order.paymentStatus,
    date: order.createdAt.toString(),
    total: order.totalAmount,
    deliveryStatus: order.deliveryStatus,
    products: order.orderItems,
  }));
  return JSON.stringify(result);
};

export default async function Profile() {
  const profile = await fetchUserProfile();
  if (!profile) return <PageNotFound />;

  const { id, name, email, avatar, verified } = profile;

  const ordersString = await fetchLatestOrders();
  if (!ordersString) return <PageNotFound />;

  const order = JSON.parse(ordersString);

  return (
    <div>
      {!verified && <EmailVerificationBanner id={id} verified={verified} />}
      <div className="p-2 md:flex md:p-4 space-y-4">
        <div className="md:border-r md:border-gray-700 p-2 space-y-2 md:p-4 md:space-y-4">
          <ProfileForm avatar={avatar} email={email} id={id} name={name} />
        </div>

        <div className="md:p-4 flex-1">
          <div className="flex items-baseline justify-between ">
            <h1 className="text-xl md:text-2xl text-blue-gray-800  font-semibold opacity-70 mb-2 md:mb-4 ">
              최근 주문내역
            </h1>
            <Link
              href="/profile/orders"
              className="text-blue-gray-500 hover:underline "
            >
              주문내역 모두보기
            </Link>
          </div>
          <div className="p-0">
            <OrderListPublic orders={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
