/**
 * Headless board UI verification captures for www.mercury.or.kr
 * Run from repo root: node scripts/capture-board-verify.mjs
 */
import { chromium } from "playwright";
import fs from "fs/promises";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function loadJson(rel) {
  const raw = await readFile(path.join(root, rel), "utf8");
  return JSON.parse(raw);
}

const notice = await loadJson("data/notice.json");
const news = await loadJson("data/news.json");
const pds = await loadJson("data/pds.json");
const freeboard = await loadJson("data/freeboard.json");

const BASE = "https://www.mercury.or.kr";
const OUT = path.join(root, "public", "screenshots", "board-verify");

await fs.mkdir(OUT, { recursive: true });

const targets = [
  { name: "home", url: "/" },
  { name: "list-notice", url: "/news/board" },
  { name: "list-news", url: "/news/news" },
  { name: "list-pds", url: "/news/pds" },
  { name: "list-freeboard", url: "/community/freeboard" },
  {
    name: "detail-notice",
    url: `/news/board/${notice[0].legacy_bd_no}`,
  },
  { name: "detail-news", url: `/news/news/${news[0].legacy_bd_no}` },
  { name: "detail-pds", url: `/news/pds/${pds[0].legacy_bd_no}` },
  {
    name: "detail-freeboard",
    url: `/community/freeboard/${freeboard[0].legacy_bd_no}`,
  },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const t of targets) {
  try {
    await page.goto(BASE + t.url + "?nocache=" + Date.now(), {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUT, `${t.name}-viewport.png`),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(OUT, `${t.name}-full.png`),
      fullPage: true,
    });
    console.log(`✓ ${t.name} (${t.url})`);
  } catch (e) {
    console.error(`✗ ${t.name} (${t.url}):`, e.message);
  }
}

await browser.close();
