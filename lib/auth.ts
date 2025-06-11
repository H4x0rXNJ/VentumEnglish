import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { AuthType, JwtPayload, User } from "@/app/types/authTypes";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (await getUserFromToken(token)) || (await getUserFromSession());
}

async function getUserFromToken(token?: string): Promise<User | null> {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const currentUser: User = {
      name: decoded.name ?? "",
      email: decoded.email ?? "",
      avatar: decoded.avatar ?? "",
      authType: decoded.authType ?? AuthType.DATABASE,
    };
    return currentUser;
  } catch {
    return null;
  }
}

async function getUserFromSession(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions);
    console.log("session", session);
    if (!session?.user) return null;

    if (!session?.user?.name || !session.user.email) {
      console.log("No complete session user found.");
      return null;
    }
    const user = session.user as typeof session.user & { authType?: AuthType };

    const currentUser: User = {
      name: user.name ?? "",
      email: user.email ?? "",
      avatar: user.image ?? "",
      authType: user.authType ?? AuthType.DATABASE,
    };
    return currentUser;
  } catch (error) {
    console.error("getUserFromSession error:", error);
    return null;
  }
}

const providerToAuthType: Record<string, AuthType> = {
  credentials: AuthType.DATABASE,
  google: AuthType.GOOGLE,
  facebook: AuthType.FACEBOOK,
};

export function getAuthTypeFromProvider(provider?: string): AuthType {
  return providerToAuthType[provider ?? "credentials"] ?? AuthType.DATABASE;
}
