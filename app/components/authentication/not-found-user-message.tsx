import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function handleToastDismiss() {
  toast.dismiss();
}
export function NoUserFoundMessage() {
  return (
    <span>
      No user is found with the provided credentials. If you have forgotten your
      password, click here to,{" "}
      <Link
        onClick={handleToastDismiss}
        href="/forgot-password"
        className="underline text-black-500 cursor-pointer"
      >
        reset it
      </Link>
      . If you do not have an account, please{" "}
      <Link
        onClick={handleToastDismiss}
        href="/sign-up"
        className="underline text-black-500 cursor-pointer"
      >
        sign up
      </Link>
      .
    </span>
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
