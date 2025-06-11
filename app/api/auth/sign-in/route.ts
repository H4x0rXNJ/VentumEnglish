import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@/lib/db";
import { ERROR_CODES, ERROR_MESSAGES } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { AuthType } from "@/app/types/authTypes";
import { ApiError } from "@/lib/errors";

function validateInput(email?: string, password?: string): void {
  if (!email || !password) {
    throw new ApiError(400, ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
  }
}

async function findUserOrThrow(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(401, ERROR_CODES.USER_NOT_FOUND);
  }
  return user;
}

function checkUserEnabled(user: { enabled: boolean }): void {
  if (!user.enabled) {
    throw new ApiError(403, ERROR_MESSAGES.ACCOUNT_DISABLED);
  }
}

async function verifyPasswordOrThrow(
  inputPassword: string,
  hashedPassword: string,
): Promise<void> {
  const isValid = await bcrypt.compare(inputPassword, hashedPassword);
  if (!isValid) {
    throw new ApiError(401, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
}

type JwtPayload = {
  email: string;
  name: string;
  avatar: string;
  authType: AuthType;
};

function createToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

function createResponse(token: string, email: string) {
  const res = NextResponse.json(
    { message: `Welcome to ${email}`, token },
    { status: 200 },
  );

  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 3600,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

async function updateAuthenticationType(
  email: string,
  currentAuthType: AuthType,
) {
  if (currentAuthType !== AuthType.DATABASE) {
    await prisma.users.update({
      where: { email },
      data: { authentication_type: AuthType.DATABASE },
    });
  }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    validateInput(email, password);
    const user = await findUserOrThrow(email);
    checkUserEnabled(user);
    await verifyPasswordOrThrow(password, user.password);
    await updateAuthenticationType(
      user.email,
      user.authentication_type as AuthType,
    );
    const token = createToken({
      email: user.email,
      name: user.name,
      authType: AuthType.DATABASE,
      avatar: user.photos || "",
    });

    return createResponse(token, email);
  } catch (error: unknown) {
    if (isApiError(error)) {
      return NextResponse.json(
        { message: error.message, errorCode: error.errorCode },
        { status: error.status },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
