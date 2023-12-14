"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
  Chip,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import truncate from "truncate";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useTransition } from "react";

interface Props {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail: string;
    sale: number;
    price: {
      base: number;
      discounted: number;
    };
  };
}

export default function ProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { loggedIn } = useAuth();

  const addToCart = async () => {
    if (!product.id) return;
    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.warning(error.message);
  };

  return (
    <Card className="w-full">
      <Link className="w-full" href={`/${product.title}/${product.id}`}>
        <CardHeader
          shadow={false}
          floated={false}
          className="relative w-full aspect-square m-0"
        >
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute right-0 p-2">
            <Chip color="red" value={`${product.sale}% 할인`} />
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-2">
            <h3 className="line-clamp-1 font-medium text-blue-gray-800">
              {truncate(product.title, 50)}
            </h3>
          </div>
          <div className="flex justify-end items-center space-x-2 mb-2">
            <Typography
              color="blue-gray"
              className="font-medium line-through decoration-deep-orange-500"
            >
              {product.price.base.toLocaleString()}원
            </Typography>
            <Typography color="blue-gray" className="font-medium">
              {product.price.discounted.toLocaleString()}원
            </Typography>
          </div>
          <div className="sm:h-14">
            <p className="font-normal text-sm opacity-75 line-clamp-3">
              {product.description}
            </p>
          </div>
        </CardBody>
      </Link>
      <CardFooter className="pt-0 space-y-4">
        <Button
          ripple={false}
          fullWidth={true}
          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
          onClick={() => startTransition(async () => await addToCart())}
        >
          장바구니에 넣기
        </Button>
        <Button
          ripple={false}
          fullWidth={true}
          className="bg-blue-400 text-white shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
        >
          바로 구매하기
        </Button>
      </CardFooter>
    </Card>
  );
}
