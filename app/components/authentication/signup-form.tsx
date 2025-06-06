"use client";
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useState} from "react";
import Link from "next/link";
import {signUp} from "@/app/components/authentication/sign-up-request";
import {toast} from "sonner"
import {Loader2} from "lucide-react";
import * as yup from "yup";
import {Validation} from "@/lib/validation";
import {PasswordErrorList} from "@/app/components/password-error-list";
import {EmailInUseNotice} from "@/app/components/authentication/not-found-user-message";
import {Eye, EyeClosed} from "phosphor-react";

const emailSchema = yup
    .string()
    .email("Invalid email format")
    .required("Email is required");

interface SignUpResult {
    success: boolean;
    error?: string;
    message?: string;
}

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"form">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isView, setIsView] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            emailSchema.validateSync(email);
        } catch (error) {
            toast.error((error as yup.ValidationError).message);
            return;
        }

        const passwordErrors = Validation.validatePassword(password);
        if (passwordErrors.length > 0) {
            toast.error(<PasswordErrorList errors={passwordErrors}/>);
            return;
        }

        setIsLoading(true);

        try {
            const result: SignUpResult = await signUp(email, password);
            if (result.success) {
                toast.success(result.message);
                setEmail("");
                setPassword("");
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000)
            } else {
                toast.error(EmailInUseNotice());
                setIsLoading(false);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center relative">
                <svg
                    viewBox="0 0 533.5 544.3">
                    <path
                        d="M533.5 278.4c0-18.9-1.5-37-4.3-54.7H272v103.7h147.4c-6.3 34-25.5 62.8-54.4 82v68h87.9c51.4-47.3 81.6-117.1 81.6-199z"
                        fill="#4285F4"
                    />
                    <path
                        d="M272 544.3c73.5 0 135.3-24.3 180.3-65.7l-87.9-68c-24.3 16.4-55.4 26-92.4 26-71 0-131-47.9-152.6-112.4h-89.5v70.9c44.5 88.1 135.6 149.2 242.1 149.2z"
                        fill="#34A853"
                    />
                    <path
                        d="M119.4 324.5c-10.4-30.9-10.4-64.4 0-95.3v-70.9h-89.5c-37.3 73.7-37.3 161.9 0 235.6l89.5-69.4z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M272 107.7c39.9 0 75.6 13.7 103.8 40.3l77.8-77.8C402 24.9 344.1 0 272 0 165.4 0 74.3 61.1 29.8 149.2l89.5 69.4c21.6-64.5 81.6-112.4 152.7-112.4z"
                        fill="#EA4335"
                    />
                </svg>
                Sign up with Google
            </Button>
            <div
                className="after:border-border text-gray-400 relative text-center text-xs font-medium after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with email</span>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                    />
                </div>

                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={isView ? "text" : "password"}
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && (
                        <div
                            className="absolute right-3 top-[52%] -translate-y-1/2 cursor-pointer text-zinc-900 transition-opacity duration-200"
                            onClick={() => setIsView((prev) => !prev)}
                        >
                            {isView ? <EyeClosed size={18}/> : <Eye size={18}/>}
                        </div>
                    )}
                </div>

                <Button type="submit" className="w-full relative" disabled={isLoading || !email || !password}>
                    Sign up
                    {isLoading && (
                        <Loader2
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin z-10"
                            style={{animationDuration: '0.5s'}}
                            aria-hidden="true"
                        />
                    )}
                </Button>

            </div>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </form>
    )
}