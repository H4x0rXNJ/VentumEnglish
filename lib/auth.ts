import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next";
import { JWT_SECRET } from "@/env";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthType } from "@/app/types/authTypes";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (await getUserFromToken(token)) || (await getUserFromSession());
}

async function getUserFromToken(token?: string) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== "object" || decoded === null) return null;
    return decoded;
  } catch {
    return null;
  }
}

async function getUserFromSession() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    const { name, email, image: avatar, authType } = session.user;
    return { name, email, avatar, authType };
  } catch {
    return null;
  }
}
