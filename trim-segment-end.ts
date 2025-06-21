import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM-friendly __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔍 File input/output
const inputPath = path.join(__dirname, "public/audios/simple-small-talk.json");

// Kiểu dữ liệu
type Segment = {
  id: number;
  start: number;
  end: number;
  text: string;
};

type FileData = {
  text: string;
  segments: Segment[];
};

try {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const parsed: FileData = JSON.parse(raw);

  const trimmed = parsed.segments.map((seg, index, array) => {
    const next = array[index + 1];
    let newEnd = seg.end;

    // Nếu có đoạn sau → trim end về gần start đoạn sau
    if (next) {
      newEnd = Math.min(seg.end, parseFloat((next.start - 0.1).toFixed(2)));
    } else {
      // Nếu là đoạn cuối → giảm nhẹ 0.1s nếu đủ dài
      if (seg.end - seg.start > 0.1) {
        newEnd = parseFloat((seg.end - 0.1).toFixed(2));
      }
    }

    return {
      ...seg,
      end: Math.max(seg.start, newEnd), // đảm bảo không bị âm
    };
  });

  const result: FileData = {
    text: parsed.text,
    segments: trimmed,
  };

  fs.writeFileSync(inputPath, JSON.stringify(result, null, 2), "utf-8");
  console.log("✅ Đã trim xong:", inputPath);
} catch (err) {
  console.error("❌ Lỗi khi xử lý:", err);
}
