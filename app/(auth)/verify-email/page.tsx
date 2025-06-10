import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function VerifySuccessPage() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("email_verified")?.value;

  if (verified !== "1") {
    redirect("/verify-error");
  }
  if (verified === "1") {
    redirect("/verify-success");
  }
}
