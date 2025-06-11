"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type UseLogoutRequestOptions = {
  redirectTo?: string;
  shouldRefresh?: boolean;
  authType?: string;
};

export function useLogoutRequest({
  redirectTo,
  shouldRefresh = true,
  authType,
}: UseLogoutRequestOptions = {}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log(authType);
      if (authType === "DATABASE") {
        await fetch("/api/auth/logout", { method: "POST" });
      } else {
        await signOut({ redirect: false });
      }

      if (redirectTo) {
        router.push(redirectTo);
      } else if (shouldRefresh) {
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { handleLogout };
}
