import React from "react";
interface PasswordErrorListProps {
    errors: string[];
}

export function PasswordErrorList({ errors }: PasswordErrorListProps) {
    return (
        <div className="text-left space-y-2">
            <p>Your password does&#39;t meet our security requirements:</p>
            <ul className="space-y-1">
                {errors.map((error, i) => (
                    <li key={i} className="flex gap-2 items-start">
                        <span className="mt-1">•</span>
                        <span>{error}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
