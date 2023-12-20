"use client";

import React, { useState } from "react";
import CartCountUpdater from "@components/CartCountUpdater";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { rgbDataURL } from "@utils/blurDataUrl";

export interface Product {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  totalPrice: number;
  quantity: number;
}

interface CartItemsProps {
  products: Product[];
  cartTotal: number;
  totalQty: number;
  cartId: string;
}

const CartItems: React.FC<CartItemsProps> = ({
  products = [],
  totalQty,
  cartTotal,
}) => {
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <div className="hidden md:flex">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-4">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    height={50}
                    width={50}
                    priority
                    style={{ width: "50px", height: "50px" }}
                    placeholder="blur"
                    blurDataURL={rgbDataURL(237, 181, 6)}
                  />
                </td>
                <td className="py-4 ">{product.title}</td>
                <td className="py-4 text-sm font-semibold">
                  {`${product.totalPrice.toLocaleString()}원`}
                </td>
                <td className="py-4 ">
                  <CartCountUpdater value={product.quantity} disabled={busy} />
                </td>
                <td className="py-4 text-right">
                  <button
                    disabled={busy}
                    className="text-red-500"
                    style={{ opacity: busy ? "0.5" : "1" }}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className=" md:hidden px-2 pb-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-row p-4 border-b border-blue-gray-200"
          >
            <div className="flex items-center justify-between pb-3">
              <div className="text-lg font-semibold">{product.title}</div>
              <button
                disabled={busy}
                className="text-red-500"
                style={{ opacity: busy ? "0.5" : "1" }}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2">
              <Image
                src={product.thumbnail}
                alt={product.title}
                height={40}
                width={40}
                priority
                style={{ width: "40px", height: "40px" }}
                placeholder="blur"
                blurDataURL={rgbDataURL(237, 181, 6)}
              />
              <div>
                <div className="text-base font-semibold">
                  {`${product.totalPrice.toLocaleString()}원`}
                </div>
                <div className="">
                  <CartCountUpdater value={product.quantity} disabled={busy} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-end items-end space-y-4">
        <div className="flex justify-end space-x-4 text-blue-gray-800">
          <p className="font-semibold text-2xl">총합</p>
          <div>
            <p className="font-semibold text-2xl">{`${cartTotal.toLocaleString()}원`}</p>
            <p className="text-right text-sm">{totalQty} 개</p>
          </div>
        </div>
        <Button
          className="shadow-none hover:shadow-none  focus:shadow-none focus:scale-105 active:scale-100"
          color="green"
          disabled={busy}
        >
          결제하기
        </Button>
      </div>
    </div>
  );
};

export default CartItems;