import { ResetPasswordForm } from "@/app/components/authentication/ResetPasswordForm";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;
  const user = token
    ? await prisma.users.findFirst({
        where: {
          reset_password_token: token,
          reset_password_token_expiration_time: { gte: new Date() },
        },
      })
    : null;

  if (!user) redirect("/verify-error");

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
