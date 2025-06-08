import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const numericId = Number(id);
  if (isNaN(numericId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    await prisma.invoice.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    const status = code === "P2025" ? 404 : 500;
    const error =
      code === "P2025" ? "Invoice not found" : "Internal server error";
    return NextResponse.json({ error }, { status });
  }
}
