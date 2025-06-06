export const updateUserEnabledStatus = async (userId: number, enabled: boolean) => {
    const res = await fetch("/api/users/toggle-lock", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId.toString(), enabled }),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update user status");
    }
    return res.json();
};

export const handleUserStatusToggle = async (
    userId: number,
    enabled: boolean,
    onToggle: (id: number, enabled: boolean) => void
) => {
    try {
        const data = await updateUserEnabledStatus(userId, !enabled);
        onToggle(userId, data.user.enabled);
    } catch (error) {
        console.error(error);
    }
};