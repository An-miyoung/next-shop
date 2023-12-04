"use client";

import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function EmailVerificationBanner() {
  const [submitting, setSubmitting] = useState(false);
  const { profile } = useAuth();
  if (!profile) return null;

  const applyForReverification = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/users/verify?userId=${profile.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const { message, error } = await res.json();
    if (!res.ok && error) {
      toast.warning(error);
    }
    if (res.ok && message) {
      toast.success(message);
    }

    setSubmitting(false);
  };

  return (
    <div className=" p-2 text-center bg-blue-100">
      <span>이메일을 인증해 주세요.</span>
      <button
        onClick={applyForReverification}
        disabled={submitting}
        className="ml-2 font-semibold underline"
      >
        {submitting ? "인증하는 중..." : "이메일 인증하기"}
      </button>
    </div>
  );
}
