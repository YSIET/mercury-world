import { NextRequest, NextResponse } from "next/server";
import { migrateLegacyToKv } from "@/lib/migrate-legacy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const overwrite = req.nextUrl.searchParams.get("overwrite") === "1";
  try {
    const result = await migrateLegacyToKv({ dryRun, overwrite });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        dryRun,
        migrated: { notice: 0, news: 0, pds: 0, freeboard: 0 },
        skipped: { notice: 0, news: 0, pds: 0, freeboard: 0 },
        errors: [String(e)],
      },
      { status: 500 }
    );
  }
}
