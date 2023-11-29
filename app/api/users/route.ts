// 회원가입한 정보로 DB 에 새로운 User 를 만들고
// 이메일 인증을 위한 verification token 을 만들어
// DB 에 새로운 EmailVerificationToken 를 만든다.

import EmailVerificationToken from "@models/emailVerificationToken";
import { NewUserRequest } from "@app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_MAILTRANSPORT_AUTH_USER,
      pass: process.env.MAILTRAP_MAILTRANSPORT_AUTH_PASS,
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "support@next-shop.com",
    to: newUser.email,
    html: `<h1><a href="${verificationUrl}">여기</a>를 클릭해서 이메일인증을 해 주세요.</h1>`,
  });

  return NextResponse.json({
    message: "회원가입을 마무리하려면, 이메일을 확인해주세요",
  });
};
