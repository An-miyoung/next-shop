import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const values = await req.json();

  return NextResponse.json({
    ok: true,
    message: "signup success",
  });
};
