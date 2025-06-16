import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  const roles = ["ADMIN", "GUEST"];

  for (const name of roles) {
    await prisma.roles.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
