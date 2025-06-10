import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/constants/errors";

export async function POST() {
  const response = NextResponse.json({
    message: ERROR_MESSAGES.LOGOUT_SUCCESS,
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
