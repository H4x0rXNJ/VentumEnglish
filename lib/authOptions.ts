import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { getAuthTypeFromProvider } from "@/lib/auth";
import { AuthType } from "@/app/types/authTypes";

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
            update: { ...userFields },
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

    session({ session, token }) {
      if (token?.authType && session.user) {
        session.user.authType = token.authType as AuthType;
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
