import OrderListPublic, { Orders } from "@components/OrderListPublic";
import startDb from "@/app/lib/db";
import OrderModel from "@/app/models/orderModel";
import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const fetchOrders = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return null;

  const userId = session.user.id;
  await startDb();
  const orders = await OrderModel.find({ userId });
  if (!orders) return null;

  const results: Orders[] = orders.map((order) => ({
    id: order._id.toString(),
    paymentStatus: order.paymentStatus,
    date: order.createdAt.toString(),
    total: order.totalAmount,
    deliveryStatus: order.deliveryStatus,
    products: order.orderItems,
  }));
  return JSON.stringify(results);
};

export default async function OrdersPage() {
  const orders = await fetchOrders();
  if (!orders) return redirect("/404");

  return (
    <div>
      <OrderListPublic orders={JSON.parse(orders)} />
    </div>
  );
}
