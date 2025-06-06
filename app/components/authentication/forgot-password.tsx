'use client';

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useState} from "react";
import Link from "next/link";
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import {signIn} from "next-auth/react";
import {authForgotPassword} from "@/app/components/authentication/forogot-password-request";
import {ERROR_CODES} from "@/constants/errors";
import {NoUserFoundMessage} from "@/app/components/authentication/not-found-user-message";
import {FacebookIcon, GoogleIcon} from "@/app/components/icons/icons";

export function ForgotPasswordForm({
                                       className,
                                       ...props
                                   }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const {success, errorCode, message} = await authForgotPassword(email);
            if (success) {
                toast.success(message);
            } else {
                if (errorCode === ERROR_CODES.USER_NOT_FOUND) {
                    toast(<NoUserFoundMessage/>);
                } else {
                    toast.error(message);
                }
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-xl font-bold">Forgot Password</h1>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full relative" disabled={isLoading || !email}>
                            Continue
                            {isLoading && (
                                <Loader2
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin z-10"
                                    style={{animationDuration: '0.5s'}}
                                    aria-hidden="true"
                                />
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            Remember your password?{" "}
                            <Link href="/sign-in" className="underline underline-offset-4">
                                Sign in
                            </Link>
                        </div>
                    </div>
                    <div
                        className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button type="button" onClick={() => signIn("facebook", {callbackUrl: "/dashboard"})}
                                variant="outline" className=" cursor-pointer w-full flex items-center justify-center">
                            <FacebookIcon/>
                            Login with Facebook
                        </Button>

                        <Button type="button" onClick={() => signIn("google", {callbackUrl: "/dashboard"})} variant="outline"
                                className=" cursor-pointer w-full flex items-center justify-center relative">
                            <GoogleIcon/>
                            Login with Google
                        </Button>
                    </div>
                </div>
            </form>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
