import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 },
    );
  }

  const user = await prisma.users.findFirst({
    where: { verification_code: code },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/verify-error", req.url));
  }

  await prisma.users.update({
    where: { id: user.id },
    data: {
      enabled: true,
      verification_code: null,
      updated_on: new Date(),
    },
  });

  const response = NextResponse.redirect(new URL("/verify-success", req.url));
  response.cookies.set("email_verified", process.env.EMAIL_VERIFIED_SECRET!, {
    maxAge: 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}
