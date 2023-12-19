"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="p-4">
      <h2>사용자의 입력을 처리하는 데 문제가 발생했습니다.</h2>
      <button
        onClick={() => {
          router.refresh();
          router.push("/");
        }}
        className=" underline"
      >
        Home 화면으로 돌아갑니다.
      </button>
    </div>
  );
}
