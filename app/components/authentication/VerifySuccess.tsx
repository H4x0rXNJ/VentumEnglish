"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "phosphor-react";

export function VerifySuccess() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-bold bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-black-500 mb-4 flex items-center gap-2">
        <CheckCircle size={50} />
        Email Verified
      </h1>
      <p className="text-gray-500 text-muted-foreground font-medium mb-6 max-w-lg">
        Congratulations! You have successfully verified your email address. You
        can now continue to the next step.
      </p>
      <Link href="/sign-in">
        <Button>Go to Sign In</Button>
      </Link>
    </div>
  );
}
