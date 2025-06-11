"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authSignIn } from "@/app/components/authentication/authSignIn";
import "@/app/(auth)/sign-up/alert-animations.css";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { FacebookIcon, GoogleIcon } from "@/app/components/icons/Icon";
import { ERROR_CODES } from "@/constants/errors";
import { NoUserFoundMessage } from "@/app/components/authentication/NoUserFoundMessage";
import { PiHandEye } from "react-icons/pi";
import { FaRegEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const logoutSuccess = searchParams.get("logout") === "success";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastShown = useRef(false);
  const pathname = usePathname();
  const [isView, setIsView] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (logoutSuccess && !toastShown.current) {
      toastShown.current = true;
      toast.success("Logout successful!");
      router.replace(pathname, { scroll: false });
    }
  }, [logoutSuccess]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const { success, message, errorCode } = await authSignIn(email, password);
    if (success) {
      router.push("/ventum");
    } else {
      if (errorCode === ERROR_CODES.USER_NOT_FOUND) {
        toast(<NoUserFoundMessage />);
      } else {
        toast.error(message);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(" flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>

      <Button
        type="button"
        onClick={() => signIn("facebook", { callbackUrl: "/ventum" })}
        variant="outline"
        className=" cursor-pointer w-full flex items-center justify-center"
      >
        <FacebookIcon />
        Login with Facebook
      </Button>

      <Button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/ventum" })}
        variant="outline"
        className=" cursor-pointer w-full flex items-center justify-center relative"
      >
        <GoogleIcon />
        Login with Google
      </Button>

      <div className="after:border-border text-gray-400 relative text-center text-xs font-medium after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with email
        </span>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="forgot-password"
              className="ml-auto text-xs font-medium white underline-offset-4 hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={isView ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            {password && (
              <div
                className="dark:text-white absolute right-3 top-[52%] -translate-y-1/2 cursor-pointer text-zinc-900 transition-opacity duration-200"
                onClick={() => setIsView((prev) => !prev)}
              >
                {isView ? <PiHandEye size={20} /> : <FaRegEyeSlash size={20} />}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full relative"
          disabled={isLoading || !email || !password}
        >
          Sign in
          {isLoading && (
            <Loader2
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-6 w-6"
              style={{ animationDuration: "0.5s" }}
            />
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
