import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "mobile-favicon.png");
const PUBLIC = join(ROOT, "public");

const PNG_OUTPUTS = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
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

  const favicon16 = await resize(16).png().toBuffer();
  const favicon32 = await resize(32).png().toBuffer();
  await writeFile(join(PUBLIC, "favicon.ico"), await toIco([favicon16, favicon32]));
  console.log("Wrote favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
