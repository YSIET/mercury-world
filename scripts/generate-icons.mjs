import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "mobile-favicon.png");
const PUBLIC = join(ROOT, "public");

/** 모바일/PWA 전용 (데스크톱 favicon 파일은 생성하지 않음) */
const PNG_OUTPUTS = [
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];

function resize(size) {
  return sharp(SRC).resize(size, size, {
    fit: "cover",
    position: "center",
  });
}

async function main() {
  for (const [filename, size] of PNG_OUTPUTS) {
    await resize(size).png().toFile(join(PUBLIC, filename));
    console.log(`Wrote ${filename} (${size}x${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
