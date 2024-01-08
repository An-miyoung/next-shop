import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import startDb from "../lib/db";
import UserModel from "../models/userModel";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { PageNotFound } from "./404";

const NaverSignin = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return <PageNotFound />;

  const res = await signIn("naver", { redirect: true, callbackUrl: "/" });
  if (res?.error) {
    const toastMsg = () => (
      <div>
        네이버로그인에 실패했습니다.
        <br />
        다시 시도해 주세요.
      </div>
    );
    toast.warning(toastMsg);
  }
  if (res?.ok) {
    console.log("res:", res);
    console.log("session: ", session);
    await startDb();

    await UserModel.create({
      name: session.user.name || "네이버회원",
      email: session.user.email,
      password: null,
      role: "user",
      avatar: session.user.image,
      verified: true,
    });
  }
};
