import "next-auth";
import { AuthType } from "@/app/types/authTypes";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      authType?: AuthType;
    };
  }

  interface User {
    authType?: AuthType;
  }
}
