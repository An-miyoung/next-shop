"use client";
import React, { useEffect } from "react";
import { PageNotFound } from "@components/404";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

export default function Verify({ searchParams }: Props) {
  const { token, userId } = searchParams;
  const router = useRouter();

  // useEffect 는 aync, await 를 내부에 쓸수 없어서, fetch().then() 사용.
  // then 내부에서는 aync, await 사용가능
  useEffect(() => {
    fetch(`/api/users/verify`, {
      method: "POST",
      body: JSON.stringify({ token, userId }),
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      const result = await res.json();
      const { message, error } = result as { message: string; error: string };
      if (res.ok) {
        toast.success(message);
        router.replace("/");
      }
      if (!res.ok && error) {
        toast.warning(error);
      }
    });
  }, [token, userId, router]);

  if (!token || !userId) return <PageNotFound />;

  return (
    <div className="text-xl md:text-2xl opacity-70 text-center p-8 animate-pulse">
      잠깐만 기다려주세요...
      <p className="p-6">이메일 인증중입니다.</p>
    </div>
  );
}
