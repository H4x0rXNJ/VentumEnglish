import {ResetPasswordForm} from "@/app/components/authentication/reset-password";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";


export default async function ResetPasswordPage({params}: { params: { token: string } }) {
    const {token} = await params;

    if (!token) {
        redirect("/verify-error");
    }

    const user = await prisma.users.findFirst({
        where: {
            reset_password_token: token,
            reset_password_token_expiration_time: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        redirect("/verify-error");
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ResetPasswordForm token={token}/>
            </div>
        </div>
    );
}
