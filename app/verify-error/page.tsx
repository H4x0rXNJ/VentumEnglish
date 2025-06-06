'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SmileyXEyes} from "phosphor-react";

export default function VerifyErrorPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center font-bold bg-gray-50 px-4 text-center">
            <p className="text-xl font-bold text-black-500 mb-4 flex items-center gap-2">
                <SmileyXEyes size={50}/> The verification code is invalid or has expired. Please try again.
            </p>
            <Button>
                <Link href="/sign-up" className="w-full block">
                    Sign up
                </Link>
            </Button>
        </div>
    );
}
