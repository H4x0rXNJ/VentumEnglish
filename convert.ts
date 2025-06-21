import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(
  __dirname,
  "public",
  "audios",
  "simple-small-talk.json",
); // file cũ
const outputPath = path.join(
  __dirname,
  "public",
  "audios",
  "simple-small-talk.json",
); // file mới

type Segment = {
  id: number;
  start: number;
  end: number;
  text: string;
};

try {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const segments: Segment[] = JSON.parse(raw);

  const fullText = segments.map((s) => s.text.trim()).join(" ");

  const output = {
    text: fullText,
    segments: segments,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log("✅ Đã tạo file mới với text đầy đủ ở đầu:", outputPath);
} catch (err) {
  console.error("❌ Lỗi:", err);
}
