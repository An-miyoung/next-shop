// 비밀번호 재설정링크를 보내준다.

import PasswordResetToken from "@/app/models/passwordResetToken";
import UserModel from "@/app/models/userModel";
import { ForgetPasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;

    if (!email) {
      return NextResponse.json(
        {
          error: "이메일이 비어있습니다.",
        },
        {
          status: 401,
        }
      );
    }

    await startDb();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          error: "가입하지 않은 이메일입니다.",
        },
        {
          status: 404,
        }
      );
    }

    // 혹시 있을지도 모를 passwordResetToken 을 지운다
    await PasswordResetToken.findOneAndDelete({ user: user._id });

    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetToken.create({
      user: user._id,
      token,
    });

    const resetPasswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_MAILTRANSPORT_AUTH_USER,
        pass: process.env.MAILTRAP_MAILTRANSPORT_AUTH_PASS,
      },
    });

    await transport.sendMail({
      from: "support@next-shop.com",
      to: user.email,
      html: `<h1><a href="${resetPasswordLink}">여기</a>를 클릭해서 비밀번호를 재설정 해주세요.</h1>`,
    });

    return NextResponse.json({
      message: "비밀번호 재설정을 하려면, 이메일을 확인해 주세요.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
