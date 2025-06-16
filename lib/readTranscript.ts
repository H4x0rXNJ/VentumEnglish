import { promises as fs } from "fs";
import path from "path";

export async function readTranscript(relativePath: string) {
  if (!relativePath) {
    throw new Error("Invalid relativePath: must be a non-empty string");
  }
  const fullPath = path.join(process.cwd(), "public", relativePath);
  const json = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(json);
}
