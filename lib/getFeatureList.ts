import { prisma } from "@/lib/prisma";

export async function getCategoriesWithLessons() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });
}
