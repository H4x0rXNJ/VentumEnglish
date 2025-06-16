import { prisma } from "@/lib/prisma";

export async function getLessonBySlug(slug: string) {
  return prisma.lesson.findUnique({
    where: { slug },
  });
}
