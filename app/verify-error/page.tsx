'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SmileyXEyes} from "phosphor-react";

export default function VerifyErrorPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center font-sans bg-gray-50 px-6 text-center">
            <p className="text-xl font-medium text-gray-700 mb-6 flex items-center gap-3 leading-relaxed">
                <SmileyXEyes size={50} />
                The verification code is invalid or has expired. Please try again.
            </p>
            <Button className="w-full max-w-xs">
                <Link href="/sign-up" className="block w-full">
                    Sign up
                </Link>
            </Button>
        </div>

    );
}
