import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@/lib/db";
import { JWT_SECRET } from "@/env";
import { ERROR_CODES, ERROR_MESSAGES } from "@/constants/errors";

export class ApiError extends Error {
  status: number;
  errorCode: string;

  constructor(status: number, errorCode: string, message?: string) {
    super(message ?? errorCode);
    this.status = status;
    this.errorCode = errorCode;
  }
}

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

function createToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
}

function createResponse(token: string, email: string) {
  const res = NextResponse.json(
    { message: `Welcome to ${email}` },
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

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    validateInput(email, password);
    const user = await findUserOrThrow(email);
    checkUserEnabled(user);
    await verifyPasswordOrThrow(password, user.password);

    const token = createToken(email);

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
