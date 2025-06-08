export async function authForgotPassword(email: string) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
      errorCode: data.errorCode,
    };
  }

  return {
    success: true,
    message: data.message,
  };
}
