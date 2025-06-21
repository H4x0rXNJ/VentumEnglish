import { NextResponse } from "next/server";
import { readTranscript } from "@/lib/readTranscript";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    const data = await readTranscript(path);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load transcript" },
      { status: 500 },
    );
  }
}
