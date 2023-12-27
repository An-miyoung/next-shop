"use client";

import { Avatar, Option, Select } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";
import { Order } from "../types";
import { deleveryStatusToKorean } from "@utils/transKoran";
import { rgbDataURL } from "@utils/blurDataUrl";

interface Props {
  order: Order;
  disableUpdate?: boolean;
}

type address = {
  city: string;
  country: string;
  line1: string;
  line2: string | null;
  postal_code: string;
  state: string;
};

const ORDER_STATUS = ["delivered", "ordered", "shipped"];

const formatAddress = ({
  line1,
  line2,
  city,
  country,
  state,
  postal_code,
}: address): JSX.Element => {
  return (
    <div>
      <div className="flex">
        <p className="font-semibold">
          <span className="font-normal">{line1}, </span>
        </p>
        {line2 ? (
          <p className="font-semibold">
            <span className="font-normal">{line2}</span>
          </p>
        ) : null}
      </div>
      <div className="flex items-center space-x-2">
        <p className="font-semibold">
          <span className="font-normal">{city}</span>
        </p>
        <p className="font-semibold">
          <span className="font-normal">{state}</span>
        </p>
        <p className="font-semibold">{country}</p>
      </div>
      <p className="font-semibold">
        <span className="font-normal">{postal_code}</span>
      </p>
    </div>
  );
};

export default function OrderCard({ order, disableUpdate = true }: Props) {
  const handleChange = () => {
    // 나중에
  };
  return (
    <div className="space-y-4 rounded border-blue-gray-800 border border-dashed p-4">
      <div className="flex justify-between pr-2">
        <div className="flex space-x-2">
          <Avatar src={order.customer.avatar || "/guest.jpeg"} />
          <div>
            <p className="font-semibold">{order.customer.name}</p>
            <p className="text-sm">{order.customer.email}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">주문총액</p>
          <p className="text-sm font-semibold">
            {order.subTotal.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">주소</p>
          <div className="text-sm">
            {formatAddress(order.customer.address as any)}
          </div>
        </div>
        <div>
          <Select
            disabled={disableUpdate}
            value={deleveryStatusToKorean(order.deliveryStatus)}
            label="배송상태"
            onChange={handleChange}
          >
            {ORDER_STATUS.map((op) => (
              <Option value={op} key={op}>
                {deleveryStatusToKorean(op)}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2  text-left">상품목록</th>
            <th className="py-2 px-4 text-left">금액내역</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, index) => (
            <tr
              key={product.id}
              style={
                index < order.products.length - 1
                  ? { borderBottom: "1px dotted gray" }
                  : undefined
              }
            >
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <Image
                    src={product.thumbnail}
                    width={50}
                    height={50}
                    alt={product.title}
                    priority
                    style={{ width: "80px", height: "80px" }}
                    placeholder="blur"
                    blurDataURL={rgbDataURL(237, 181, 6)}
                  />
                  <div>
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm">
                      단가: {product.price.toLocaleString()}
                    </p>
                    <p className="text-sm">수량: {product.quantity}</p>
                  </div>
                </div>
              </td>
              <td className="py-2 px-4">
                총금액: {product.totalPrice.toLocaleString()}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
