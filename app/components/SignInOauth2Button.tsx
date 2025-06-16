"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";

type SocialLoginButtonProps = {
  provider: "Google" | "Facebook" | string;
  icon: ReactNode;
  label: string;
};

export function SignInOauth2Button({
  provider,
  icon,
  label,
}: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: "/" })}
      variant="outline"
      className="cursor-pointer w-full flex items-center justify-center gap-2"
    >
      {icon}
      {label}
    </Button>
  );
}
