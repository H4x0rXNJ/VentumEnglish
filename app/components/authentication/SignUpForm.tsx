"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/app/components/icons/Icon";
import Link from "next/link";
import { toast } from "sonner";
import { ERROR_CODES } from "@/constants/errors";
import { EmailInUseNotice } from "@/app/components/authentication/NoUserFoundMessage";
import { PiHandEye } from "react-icons/pi";
import { FaRegEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import * as yup from "yup";
import { Validation } from "@/lib/validation";
import { authSignUp } from "@/app/components/authentication/authSignUp";
import { PasswordErrorList } from "@/app/components/authentication/PasswordErrorList";

const emailSchema = yup
  .string()
  .email("Invalid email format")
  .required("Email is required");

interface SignUpResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      emailSchema.validateSync(email);
    } catch (error) {
      toast.error((error as yup.ValidationError).message);
      return;
    }
    setIsLoading(true);

    const emailInUse = await checkEmailExists(email);
    if (emailInUse) {
      toast.error(EmailInUseNotice());
      setIsLoading(false);
      return;
    }

    const passwordErrors = Validation.validatePassword(password);
    if (passwordErrors.length > 0) {
      toast.error(<PasswordErrorList errors={passwordErrors} />);
      setIsLoading(false);
      return;
    }

    try {
      const result: SignUpResult = await authSignUp(email, password);
      if (result.success) {
        toast.success(result.message);
        setEmail("");
        setPassword("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create a new account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className={cn(" flex flex-col gap-6", className)}
            {...props}
          >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  variant="outline"
                  className=" cursor-pointer w-full flex items-center justify-center relative"
                >
                  <GoogleIcon />
                  Sign up with Google
                </Button>
                <div className="text-xs font-medium text-gray-500 text-center text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
                  By clicking “Sign up with Google”, you agree to our{" "}
                  <a href="#">Terms of Service,</a> and{" "}
                  <a href="#">Privacy Policy,</a> and consent to receive
                  updates, special offers, and promotional emails. I understand
                  that I can opt out at any time.
                </div>
              </div>
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
                  disabled={isLoading || !email || !password}
                >
                  Sign up
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
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
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
