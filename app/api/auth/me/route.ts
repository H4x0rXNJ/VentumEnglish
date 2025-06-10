import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { JWT_SECRET } from "@/env";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as {
      email: string;
    };

    const user = await prisma.users.findUnique({
      where: { email: payload.email },
      select: {
        email: true,
        name: true,
        photos: true,
        authentication_type: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      email: user.email,
      name: user.name,
      avatar: user.photos,
      authType: user.authentication_type,
    });
  } catch (error) {
    console.error("API /me error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
