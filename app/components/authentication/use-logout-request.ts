"use client";
import { useRouter } from "next/navigation";

type UseLogoutRequestOptions = {
  redirectTo?: string;
  shouldRefresh?: boolean;
};

export function useLogoutRequest({
  redirectTo,
  shouldRefresh = true,
}: UseLogoutRequestOptions = {}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });

      if (redirectTo) router.push(redirectTo);
      else if (shouldRefresh) router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { handleLogout };
}
