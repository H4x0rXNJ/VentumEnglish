import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  const user = await prisma.users.findFirst({
    where: {
      reset_password_token: token,
      reset_password_token_expiration_time: { gte: new Date() },
    },
  });

  if (!user)
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      reset_password_token: null,
      reset_password_token_expiration_time: null,
    },
  });

  return NextResponse.json({ message: "Change password successful" });
}
