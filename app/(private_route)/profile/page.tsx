import ProfileForm from "@components/ProfileForm";
import { redirect } from "next/navigation";
import React from "react";
import EmailVerificationBanner from "@components/EmailVerificationBanner";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import LoadingProfile from "./loading";

export const fetchUserProfile = async () => {
  const session = await getServerSession(authConfig);
  if (!session) return null;
  if (!session.user) return null;

  await startDb();
  const user = await UserModel.findById(session.user.id);
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar?.url,
    verified: user.verified,
  };
};

export default async function Profile() {
  const profile = await fetchUserProfile();
  if (!profile) return redirect("/404");

  const { id, name, email, avatar, verified } = profile;

  return (
    <div>
      {!verified && <EmailVerificationBanner id={id} verified={verified} />}
      <div className="md:flex p-4 space-y-4">
        <div className="md:border-r md:border-gray-700 p-2 space-y-2 md:p-4 md:space-y-4">
          <ProfileForm avatar={avatar} email={email} id={id} name={name} />
        </div>

        <div className="p-4 flex-1">
          <div className="flex items-baseline justify-between ">
            <h1 className="text-xl md:text-2xl text-blue-gray-800  font-semibold opacity-70 mb-2 md:mb-4 ">
              최근 주문내역
            </h1>
            <Link
              href="/profile/orders"
              className="text-blue-gray-500 hover:underline "
            >
              주문내역 모두보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
