import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ID = Promise<{ id: string }>;

export async function DELETE(_request: Request, { params }: { params: ID }) {
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.users.delete({ where: { id: userId } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    const status = code === "P2025" ? 404 : 500;
    const error = code === "P2025" ? "User not found" : "Internal server error";
    return NextResponse.json({ error }, { status });
  }
}
