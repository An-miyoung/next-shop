import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import dateFormat from "dateformat";
import React from "react";

const sevenDaysSalesHistory = async () => {
  // 7일을 계산
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  // 7일간의 데이터를 fetch
  await startDb();
  const last10DaysSales: { _id: string; totalAmount: number }[] =
    await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: tenDaysAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

  // saels 가격이 0인 날을 비교
  const dateList: string[] = [];
  for (let i = 1; i <= 10; i++) {
    // 오늘날짜 부터 -0, -1, -2 를 차례로 한다.
    const date = new Date(tenDaysAgo);
    date.setDate(date.getDate() + i);
    dateList.push(date.toISOString().split("T")[0]);
  }

  const sales = dateList.map((date) => {
    // matchedSale 은 date 하나에 대해 find 를 함으로 한개의 {} 추출
    const matchedSales = last10DaysSales.find(
      (saleDay) => date === saleDay._id
    );
    return {
      day: dateFormat(date, "ddd"),
      sale: matchedSales ? matchedSales.totalAmount : 0,
    };
  });

  // return 해주지 않으며 error
  const totalSales = last10DaysSales.reduce((prevValue, current) => {
    return (prevValue += current.totalAmount);
  }, 0);

  return { sales, totalSales };
};

export default async function Sales() {
  const { sales, totalSales } = await sevenDaysSalesHistory();
  return <div> Sales</div>;
}
