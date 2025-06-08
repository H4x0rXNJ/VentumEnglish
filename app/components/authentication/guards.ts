import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/sign-in");
  }
  return;
}
