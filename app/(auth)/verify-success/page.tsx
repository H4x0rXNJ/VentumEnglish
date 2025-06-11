import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VerifySuccess } from "@/app/components/authentication/VerifySuccess";
import * as process from "node:process";

export default async function VerifySuccessPage() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("email_verified")?.value;
  if (verified !== process.env.EMAIL_VERIFIED_SECRET) {
    redirect("/verify-error");
  }
  return <VerifySuccess />;
}
