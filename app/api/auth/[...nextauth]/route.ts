import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import { AuthType } from "@/app/types/authTypes";

const providerToAuthType: Record<string, AuthType> = {
  credentials: AuthType.DATABASE,
  google: AuthType.GOOGLE,
  facebook: AuthType.FACEBOOK,
};

export function getAuthTypeFromProvider(provider?: string): AuthType {
  return providerToAuthType[provider ?? "credentials"] ?? AuthType.DATABASE;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.email) {
        console.log("AuthType:", AuthType);
        const authType = getAuthTypeFromProvider(account?.provider);

        const now = new Date();

        const userFields = {
          name: user.name || "",
          email: user.email,
          authentication_type: authType,
          updated_on: now,
        };
        try {
          const dbUser = await prisma.users.upsert({
            where: { email: user.email },
            update: {
              ...userFields,
            },
            create: {
              ...userFields,
              password: "",
              enabled: true,
              account_non_locked: true,
              failed_attempt: 0,
              created_on: now,
            },
          });

          token.authType = authType;
          token.id = dbUser.id.toString();
          token.email = dbUser.email;
          token.name = dbUser.name;
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      return token;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
