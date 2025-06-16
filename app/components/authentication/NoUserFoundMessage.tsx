import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function handleToastDismiss() {
  toast.dismiss();
}

export function NoUserFoundMessage() {
  return (
    <div className="text-xs tracking-wide">
      <span>
        No user is found with the provided credentials. If you have forgotten
        your password,{" "}
        <Link
          onClick={handleToastDismiss}
          href="/forgot-password"
          className="font-bold underline ring-0 outline-gray-alpha-950 focus-visible:underline focus-visible:ring-1 focus-visible:ring-ring"
        >
          click here{" "}
        </Link>
        to reset it. If you do not have an account,{" "}
        <Link
          onClick={handleToastDismiss}
          href="/sign-up"
          className="font-bold  underline ring-0 outline-gray-alpha-950 focus-visible:underline focus-visible:ring-1 focus-visible:ring-ring"
        >
          please sign up
        </Link>
        .
      </span>
    </div>
  );
}

export function EmailInUseNotice() {
  return (
    <span>
      Email is already in use.{" "}
      <Link
        onClick={handleToastDismiss}
        href="/sign-in"
        className="underline font-medium text-black cursor-pointer"
      >
        Sign in?
      </Link>
    </span>
  );
}
