import { randomBytes } from "crypto";

export function generateHexCode() {
  return randomBytes(32).toString("hex");
}
