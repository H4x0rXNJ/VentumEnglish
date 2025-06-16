"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import * as yup from "yup";

import { cn } from "@/lib/utils";
import { Validation } from "@/lib/validation";
import { ERROR_CODES } from "@/constants/errors";

import { authSignIn } from "@/app/components/authentication/authSignIn";
import { authSignUp } from "@/app/components/authentication/authSignUp";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SignInOauth2Button } from "@/app/components/SignInOauth2Button";
import { FacebookIcon, GoogleIcon } from "@/app/components/icons/Icon";
import { PiHandEye } from "react-icons/pi";
import { FaRegEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";

import {
  NoUserFoundMessage,
  EmailInUseNotice,
} from "@/app/components/authentication/NoUserFoundMessage";
import { PasswordErrorList } from "@/app/components/authentication/PasswordErrorList";

export const AUTH_TYPE = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
} as const;

const emailSchema = yup
  .string()
  .email("Invalid email format")
  .required("Email is required");

type AuthFormType = "sign-in" | "sign-up";

interface AuthFormProps extends React.ComponentProps<"form"> {
  type: AuthFormType;
}

export function AuthForm({ type, className, ...props }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isView, setIsView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toastShown = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const logoutSuccess = searchParams.get("logout") === "success";

  useEffect(() => {
    if (type === AUTH_TYPE.SIGN_IN && logoutSuccess && !toastShown.current) {
      toastShown.current = true;
      toast.success("Logout successful!");
      router.replace(pathname, { scroll: false });
    }
  }, [logoutSuccess, pathname, router, type]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      emailSchema.validateSync(email);
    } catch (error) {
      toast.error((error as yup.ValidationError).message);
      setIsLoading(false);
      return;
    }

    if (type === AUTH_TYPE.SIGN_UP) {
      const emailInUse = await checkEmailExists(email);
      if (emailInUse) {
        toast.error(EmailInUseNotice());
        setTimeout(() => setIsLoading(false), 200);
        return;
      }

      const passwordErrors = Validation.validatePassword(password);
      if (passwordErrors.length > 0) {
        toast.error(<PasswordErrorList errors={passwordErrors} />);
        setIsLoading(false);
        return;
      }

      try {
        const result = await authSignUp(email, password);
        if (result.success) {
          toast.success(result.message);
          setEmail("");
          setPassword("");
        } else {
          toast.error(result.message || "Sign up failed.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      const { success, message, errorCode } = await authSignIn(email, password);
      if (success) {
        router.push("/");
      } else {
        if (errorCode === ERROR_CODES.USER_NOT_FOUND) {
          toast(<NoUserFoundMessage />);
          setTimeout(() => setIsLoading(false), 500);
        } else {
          toast.error(message);
          setIsLoading(false);
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {type === AUTH_TYPE.SIGN_IN
              ? "Welcome back"
              : "Create a new account"}
          </CardTitle>
          {type === AUTH_TYPE.SIGN_IN && (
            <CardDescription>
              Sign in to unlock your personalized learning journey with Google
              or Facebook.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
          >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                {type === AUTH_TYPE.SIGN_IN && (
                  <SignInOauth2Button
                    provider="Facebook"
                    icon={<FacebookIcon />}
                    label="Sign in with Facebook"
                  />
                )}
                <SignInOauth2Button
                  provider="Google"
                  icon={<GoogleIcon />}
                  label={
                    type === AUTH_TYPE.SIGN_IN
                      ? "Sign in with Google"
                      : "Sign up with Google"
                  }
                />
                {type === "sign-up" && (
                  <div className="text-xs text-center text-muted-foreground text-balance">
                    By clicking “Sign up with Google”, you agree to our{" "}
                    <a href="#" className="underline hover:text-primary">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-primary">
                      Privacy Policy
                    </a>
                    .
                  </div>
                )}
              </div>
              <div className="relative text-center text-xs font-medium text-gray-400 after:absolute after:inset-0 after:top-1/2 after:border-t after:z-0 after:flex after:items-center">
                <span className="bg-background relative z-10 px-2">
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
                    {type === AUTH_TYPE.SIGN_IN && (
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-xs underline hover:text-primary"
                      >
                        Forgot password
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isView ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    {password && (
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900"
                        onClick={() => setIsView((prev) => !prev)}
                      >
                        {isView ? (
                          <PiHandEye size={20} />
                        ) : (
                          <FaRegEyeSlash size={20} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full relative"
                  disabled={!email || !password}
                >
                  {type === AUTH_TYPE.SIGN_IN ? "Sign in" : "Sign up"}
                  {isLoading && (
                    <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-6 w-6" />
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                {type === AUTH_TYPE.SIGN_IN
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <Link
                  href={type === AUTH_TYPE.SIGN_IN ? "/sign-up" : "/sign-in"}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {type === AUTH_TYPE.SIGN_IN ? "Sign up" : "Sign in"}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const res = await fetch("/api/auth/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json();
    if (data.errorCode === ERROR_CODES.EMAIL_ALREADY_USE) {
      return true;
    }
  }
  return false;
}
