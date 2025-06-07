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
import {PiHandEye} from "react-icons/pi";
import {FaRegEyeSlash} from "react-icons/fa";
import {ERRORS_PASSWORD_MESSAGE} from "@/constants/errors";

interface ResetPasswordFormProps {
    token: string;
}

export function ResetPasswordForm({token}: ResetPasswordFormProps) {
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isViewNewPassword, setIsViewNewPassword] = useState(false);
    const [isViewRepeatPassword, setIsViewRepeatPassword] = useState(false);
    const router = useRouter();


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const repeatPasswordError = Validation.validatePasswordMatch(newPassword, repeatNewPassword);
        if (repeatPasswordError) {
            toast.error(repeatPasswordError);
            setIsLoading(false);
            return;
        }

        const passwordErrors = Validation.validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            toast.error(<PasswordErrorList errors={passwordErrors}/>);
            setIsLoading(false);
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
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-xl font-bold">Create a strong new password</h1>
                </div>
                <p className="text-sm text-gray-500">{ERRORS_PASSWORD_MESSAGE}</p>
                <div className="flex flex-col gap-6">
                    <div className="relative grid gap-3">
                        <Label htmlFor="password">Your new password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={isViewNewPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            {newPassword && (
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900 transition-opacity duration-200"
                                    onClick={() => setIsViewNewPassword((prev) => !prev)}>
                                    {isViewNewPassword ? <PiHandEye size={20}/> : <FaRegEyeSlash size={20}/>}
                                </div>
                            )}
                        </div>
                    </div>


                    <Label htmlFor="confirmPassword">Repeat new password</Label>
                    <div className="grid gap-3 relative">
                        <Input
                            id="repeatNewPassword"
                            name="repeatNewPassword"
                            type={isViewRepeatPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={repeatNewPassword}
                            onChange={(e) => setRepeatNewPassword(e.target.value)}
                        />

                        {repeatNewPassword && (
                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900 transition-opacity duration-200"
                                onClick={() => setIsViewRepeatPassword((prev) => !prev)}>
                                {isViewRepeatPassword ? <PiHandEye size={20}/> : <FaRegEyeSlash size={20}/>}
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full relative" disabled={isLoading || !newPassword || !repeatNewPassword}>
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
