import type { users } from "@prisma/client";

export function mapToUserDTO(user: users) {
  return {
    id: Number(user.id),
    name: user.name ?? "",
    email: user.email ?? "",
    address: user.address ?? "",
    enabled: user.enabled ?? true,
    phone_number: user.phone_number ?? "",
    photo: user.photos ?? "",
    create_on: user.created_on ?? new Date(),
    account_non_locked: user.account_non_locked ?? true,
    authentication_type: user.authentication_type ?? null,
    verification_code: user.verification_code ?? null,
    reset_password_token: user.reset_password_token ?? null,
    reset_password_token_expiration_time:
      user.reset_password_token_expiration_time ?? null,
    failed_attempt: user.failed_attempt ?? 0,
    lock_time: user.lock_time ?? null,
  };
}
