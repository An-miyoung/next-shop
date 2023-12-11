// 회원가입한 정보로 DB 에 새로운 User 를 만들고
// 이메일 인증을 위한 verification token 을 만들어
// DB 에 새로운 EmailVerificationToken 를 만든다.

import EmailVerificationToken from "@models/emailVerificationToken";
import { NewUserRequest } from "@app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;

  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const verificationUrl = `${process.env.EMAIL_VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verification",
    linkUrl: verificationUrl,
  });

  return NextResponse.json({
    message: "회원가입을 마무리하려면, 이메일을 확인해주세요",
  });
};
