import { GalleryVerticalEnd } from "lucide-react";

import { SignInForm } from "@/app/components/authentication/SignInForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTitle } from "@/lib/config";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) redirect("/");

  const pageTitle = getTitle();

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {pageTitle}
        </a>
        <SignInForm />
      </div>
    </div>
  );
}
