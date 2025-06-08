import { prisma } from "@/lib/prisma";
import { mapToUserDTO } from "@/app/mappers/user";

export async function getUserByEmail(email: string) {
  if (!email) return null;

  return prisma.users.findUnique({
    where: { email },
  });
}

export async function getAllUsers() {
  const users = await prisma.users.findMany({
    orderBy: { created_on: "asc" },
  });
  return users.map(mapToUserDTO);
}

interface UpdateUserData {
  failed_attempt?: number;
  lock_time?: Date | null;
}

export async function updateUser(
  userId: bigint,
  data: UpdateUserData,
): Promise<void> {
  await prisma.users.update({
    where: { id: userId },
    data,
  });
}
