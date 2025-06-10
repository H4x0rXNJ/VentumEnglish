export async function authSignIn(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        errorCode: data.errorCode,
        message: data.message,
      };
    }
    return { success: true, message: data.message };
  } catch {
    return { success: false, message: "Network error" };
  }
}
