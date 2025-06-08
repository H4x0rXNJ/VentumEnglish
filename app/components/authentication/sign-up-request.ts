export async function signUp(email: string, password: string) {
  try {
    const res = await fetch("/api/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error };
    }
  } catch {
    return { success: false, error: "Network error" };
  }
}
