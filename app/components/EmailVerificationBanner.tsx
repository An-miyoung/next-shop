"use client";

import React from "react";
import useAuth from "../hooks/useAuth";

export default function EmailVerificationBanner() {
  const { profile } = useAuth();
  if (!profile) return null;
  return (
    <div className=" p-2 text-center bg-blue-100">
      <span>이메일을 인증해 주세요.</span>
      <button className="ml-2 font-semibold underline">인증하기</button>
    </div>
  );
}
