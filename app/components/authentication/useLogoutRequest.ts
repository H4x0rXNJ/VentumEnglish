"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCallback, useMemo } from "react";

type UseLogoutRequestOptions = {
  redirectTo?: string;
  shouldRefresh?: boolean;
  authType?: string;
};

export function useLogoutRequest(options: UseLogoutRequestOptions = {}) {
  const { redirectTo, shouldRefresh = true, authType } = options;
  const router = useRouter();

  const memoizedOptions = useMemo(
    () => ({
      redirectTo,
      shouldRefresh,
      authType,
    }),
    [redirectTo, shouldRefresh, authType],
  );

  const handleLogout = useCallback(async () => {
    if (memoizedOptions.authType === "DATABASE") {
      await fetch("/api/auth/logout", { method: "POST" });
    } else {
      await signOut({ redirect: false });
    }

    if (memoizedOptions.redirectTo) {
      router.push(memoizedOptions.redirectTo);
    } else if (memoizedOptions.shouldRefresh) {
      router.refresh();
    }
  }, [memoizedOptions, router]);

  return useMemo(() => ({ handleLogout }), [handleLogout]);
}
