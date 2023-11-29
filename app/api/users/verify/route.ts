// signup/page -> verify/page 를 통해 들어온 token 과 userId 를 갖고
// DB 에 저장된 token과 입력값이 같은지 비교한 후
// 같으면 EmailVerificationToken 에 저장된 token 값을 지운다.

import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;

    // input value check
    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        {
          error: "Invalid Request. userId 형식이 다르거나, token 이 없습니다.",
        },
        {
          status: 401,
        }
      );
    }

    // user check
    const verifyToken = await EmailVerificationToken.findOne({ user: userId });
    if (!verifyToken) {
      return NextResponse.json(
        {
          error: "해당하는 user가 존재하지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    // token compare
    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "token 이 서로 다릅니다.",
        },
        {
          status: 401,
        }
      );
    }

    // user verified 값 변경, EmailVerificationToken DB 에서 해당 token 삭제
    await UserModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);
    return NextResponse.json(
      {
        message: "이메일 인증성공",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: "Server Error, 이메일 인증실패",
      },
      {
        status: 500,
      }
    );
  }
};
