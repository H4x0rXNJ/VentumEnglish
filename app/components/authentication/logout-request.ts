import { useRouter } from "next/navigation";

export const logoutRequest = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                router.push("/sign-in?logout=success");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    return { handleLogout };
};
