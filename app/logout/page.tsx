import {redirect} from "next/navigation";
import {cookies} from "next/headers";

export default async function LogoutPage() {

    const cookieStore = await cookies();

    cookieStore.set("token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("next-auth.session-token", "", {
        path: "/",
        expires: new Date(0),
    });
    redirect("/sign-in?logout=success");
}
