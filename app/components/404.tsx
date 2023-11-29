import React from "react";
import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-10">
      <h2 className=" text-xl mb-3  text-blue-gray-600">
        페이지가 존재하지 않습니다.
      </h2>
      <h4 className=" font-medium text-base mb-5  text-blue-gray-500">
        요청하신 페이지는 없어졌거나, 다른 주소로 이동한 페이지입니다.
      </h4>

      <div className="w-full md:w-1/3 flex items-center justify-between">
        <Link href="/" className="font-semibold  text-green-900 underline">
          Home 으로 이동
        </Link>
        <Link
          href="/auth/signup"
          className=" font-semibold  text-blue-900 underline"
        >
          로그인 으로 이동
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
