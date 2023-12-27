import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import UserModel from "@models/userModel";
import OrderCard from "@components/OrderCard";
import React from "react";
import { Order } from "@/app/types";
import { ObjectId } from "mongoose";
import { PageNotFound } from "@/app/components/404";

const fetchAllOrders = async () => {
  await startDb();
  const orders = await OrderModel.find().sort("-createdAt").limit(5).populate<{
    userId: {
      _id: ObjectId;
      name: string;
      email: string;
      avatar?: { url: string };
      address: any;
    };
  }>({
    path: "userId",
    select: "name email avatar",
    model: UserModel,
  });

  const results = orders.map(
    (order): Order => ({
      id: order._id.toString(),
      deliveryStatus: order.deliveryStatus,
      subTotal: order.totalAmount,
      // customer type error 를 해결하려면 populate 에 generic 을 줄것
      customer: {
        id: order.userId._id.toString(),
        name: order.userId.name,
        email: order.userId.email,
        avatar: order.userId.avatar?.url,
        address: order.shippingDetails.address,
      },
      products: order.orderItems,
    })
  );

  return JSON.stringify(results);
};

export default async function AdminOrdersPage() {
  const results = await fetchAllOrders();
  if (!results) return <PageNotFound />;

  const orders = JSON.parse(results) as Order[];

  return (
    <div className="py-4 space-y-4">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} disableUpdate={false} />
      ))}
    </div>
  );
}
