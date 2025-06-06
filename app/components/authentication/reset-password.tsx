'use client';

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2} from "lucide-react";
import {Validation} from "@/lib/validation";
import {PasswordErrorList} from "../password-error-list";

interface ResetPasswordFormProps {
    token: string;
}

export function ResetPasswordForm({token}: ResetPasswordFormProps) {
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const repeatPasswordError = Validation.validatePasswordMatch(newPassword, repeatNewPassword);
        if (repeatPasswordError) {
            toast.error(repeatPasswordError);
            return;
        }

        const passwordErrors = Validation.validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            toast.error(<PasswordErrorList errors={passwordErrors}/>);
            return;
        }
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token, newPassword}),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                router.push("/sign-in");
            } else {
                toast.error(data.message);
                if (data.message === "Invalid or expired token") {
                    router.push("/forgot-password");
                }
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-xl font-bold">Please enter your new Password</h1>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="password">Your new password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="confirmPassword">Repeat new password</Label>
                        <Input
                            id="repeatNewPassword"
                            name="repeatNewPassword"
                            type="password"
                            placeholder="••••••••"
                            value={repeatNewPassword}
                            onChange={(e) => setRepeatNewPassword(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full relative"
                            disabled={isLoading || !newPassword || !repeatNewPassword}>
                        Change Password
                        {isLoading && (
                            <Loader2
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin z-10"
                                style={{animationDuration: '0.5s'}}
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
