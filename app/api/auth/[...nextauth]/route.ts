import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {prisma} from "@/lib/prisma";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";

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
        })
    ],
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    callbacks: {
        async jwt({token, user}) {
            if (user?.email) {
                try {
                    const dbUser = await prisma.users.upsert({
                        where: {email: user.email},
                        update: {
                            name: user.name || "",
                            email: user.email,
                            updated_on: new Date(),
                        },
                        create: {
                            email: user.email,
                            name: user.name || "",
                            password: "",
                            enabled: true,
                            account_non_locked: true,
                            failed_attempt: 0,
                            created_on: new Date(),
                            updated_on: new Date(),
                        },
                    });

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
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST};
