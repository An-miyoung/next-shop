"use client";

import { Button, CardBody, Typography } from "@material-tailwind/react";
import Link from "next/link";
import React, { useEffect, useTransition } from "react";
import truncate from "truncate";
import { deleteFeaturedProduct } from "../(admin_route)/products/featured/action";
import { useRouter } from "next/navigation";

const TABLE_HEAD = ["배너제목", "상세페이지", ""];

interface Props {
  products: Products[];
}

interface Products {
  id: string;
  banner: string;
  title: string;
  link: string;
  linkTitle: string;
}

export default function FeaturedProductTable({ products }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    await deleteFeaturedProduct(id);
    // 모두 지운후 화면을 어떻게 처리할 것인가
    router.refresh();
  };

  return (
    <div className="py-5 mb-5">
      <CardBody className="px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              const { id, link, title } = item;
              const isLast = index === products.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {truncate(title, 100)}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Link href={link}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold hover:underline"
                      >
                        상품 바로가기
                      </Typography>
                    </Link>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center">
                      <Link
                        className="font-semibold uppercase text-xs text-blue-400 hover:underline"
                        href={`/products/featured/update?id=${id}`}
                      >
                        수정
                      </Link>
                      <Button
                        onClick={() =>
                          startTransition(async () => await handleDelete(id))
                        }
                        color="red"
                        ripple={false}
                        variant="text"
                        disabled={isPending}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </div>
  );
}