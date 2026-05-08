import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Load `.env.local` before any module that reads `process.env` (e.g. @vercel/kv).
 * ESM hoists static imports, so migration/stats are dynamic-imported below.
 */
function loadEnvLocal(): void {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) {
    console.error("[migrate-local] .env.local not found");
    process.exit(1);
  }
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvLocal();

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.error(
    "[migrate-local] KV_REST_API_URL and KV_REST_API_TOKEN must be set in .env.local"
  );
  process.exit(1);
}

async function main(): Promise<void> {
  const { migrateLegacyToKv } = await import("@/lib/migrate-legacy");
  const { getBoardStats } = await import("@/lib/stats");
  const { getPostsByBoard } = await import("@/lib/legacy-json-data");

  console.log(
    "[migrate-local] migrateLegacyToKv({ dryRun: false, verbose: true }) — idempotent skip for existing KV rows"
  );
  const result = await migrateLegacyToKv({ dryRun: false, verbose: true });

  console.log("[migrate-local] ===== FINAL RESULT (JSON) =====");
  console.log(JSON.stringify(result, null, 2));

  const board = await getBoardStats();
  const kvSum =
    board.notice + board.news + board.pds + board.freeboard;
  const legacySum =
    getPostsByBoard("notice").length +
    getPostsByBoard("news").length +
    getPostsByBoard("pds").length +
    getPostsByBoard("freeboard").length;

  console.log("[migrate-local] ===== KV vs 레거시 JSON 행 수 (참고) =====");
  const dash = {
    kvCounts: board,
    kvSum,
    legacyJsonRowSum: legacySum,
    kvMatchesLegacyJsonTotals:
      board.notice === getPostsByBoard("notice").length &&
      board.news === getPostsByBoard("news").length &&
      board.pds === getPostsByBoard("pds").length &&
      board.freeboard === getPostsByBoard("freeboard").length,
  };
  console.log(JSON.stringify(dash, null, 2));

  if (kvSum === legacySum) {
    console.log(
      `[migrate-local] OK: KV 합계 ${kvSum} === 레거시 JSON 행 합계 ${legacySum}`
    );
  } else {
    console.log(
      `[migrate-local] WARN: KV 합계 ${kvSum} !== 레거시 합 ${legacySum} — 부분 마이그레이션·미스매치 가능`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
