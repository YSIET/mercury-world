import { kv } from "@vercel/kv";

const ZKEY = "mercury:content:rows";

function rowKey(id: string) {
  return `mercury:content:row:${id}`;
}

export type MercuryContentRow = {
  id: string;
  /** 분류 (어류/갑각류 등) */
  category: string;
  /** 식품명 */
  foodName: string;
  /** 평균 mg/kg */
  avgMgKg: number;
  /** 검출 범위 표시 */
  rangeText: string;
  /** 시료 수 */
  sampleCount: number;
  /** 분석일 YYYY-MM-DD */
  analyzedAt: string;
  note: string;
  sourcePostId?: string;
};

function scoreForRow(r: MercuryContentRow): number {
  const t = Date.parse(r.analyzedAt + "T00:00:00");
  return Number.isFinite(t) ? t : 0;
}

export async function countMercuryRows(): Promise<number> {
  return (await kv.zcard(ZKEY)) ?? 0;
}

export async function listMercuryRows(): Promise<MercuryContentRow[]> {
  const ids = await kv.zrange<string[]>(ZKEY, 0, -1, { rev: true });
  if (!ids?.length) return [];
  const rows: MercuryContentRow[] = [];
  for (const id of ids) {
    const raw = await kv.get<string>(rowKey(id));
    if (!raw) continue;
    try {
      rows.push(JSON.parse(raw) as MercuryContentRow);
    } catch {
      continue;
    }
  }
  return rows;
}

/** KV가 비어 있으면 예시 2행 삽입 (C1-B, 구조 시연용) */
export async function ensureMercuryPlaceholderRows(): Promise<void> {
  if ((await kv.zcard(ZKEY)) ?? 0 > 0) return;
  const samples: MercuryContentRow[] = [
    {
      id: crypto.randomUUID(),
      category: "일반식품",
      foodName: "통조림",
      avgMgKg: 0.05,
      rangeText: "ND–0.12",
      sampleCount: 12,
      analyzedAt: "2015-11-03",
      note: "예시 행 — 실제 수치는 /admin/mercury-content에서 편집",
      sourcePostId: "legacy:19",
    },
    {
      id: crypto.randomUUID(),
      category: "어류",
      foodName: "고등어(예시)",
      avgMgKg: 0.08,
      rangeText: "0.02–0.15",
      sampleCount: 8,
      analyzedAt: "2015-10-01",
      note: "예시 행",
    },
  ];
  for (const r of samples) {
    await kv.set(rowKey(r.id), JSON.stringify(r));
    await kv.zadd(ZKEY, { score: scoreForRow(r), member: r.id });
  }
}

export function validateMercuryRowInput(x: Partial<MercuryContentRow>): string | null {
  if (!x.category?.trim()) return "분류 필요";
  if (!x.foodName?.trim()) return "식품명 필요";
  if (x.avgMgKg == null || !Number.isFinite(Number(x.avgMgKg))) return "평균 mg/kg 필요";
  if (x.sampleCount == null || !Number.isFinite(Number(x.sampleCount))) return "시료 수 필요";
  if (!x.analyzedAt?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(x.analyzedAt.trim())) {
    return "분석일은 YYYY-MM-DD";
  }
  return null;
}

export async function createMercuryRow(
  input: Omit<MercuryContentRow, "id">
): Promise<MercuryContentRow> {
  const id = crypto.randomUUID();
  const row: MercuryContentRow = {
    id,
    category: input.category.trim(),
    foodName: input.foodName.trim(),
    avgMgKg: Number(input.avgMgKg),
    rangeText: (input.rangeText ?? "").trim(),
    sampleCount: Math.floor(Number(input.sampleCount)),
    analyzedAt: input.analyzedAt.trim(),
    note: (input.note ?? "").trim(),
    sourcePostId: input.sourcePostId?.trim() || undefined,
  };
  const err = validateMercuryRowInput(row);
  if (err) throw new Error(err);
  await kv.set(rowKey(id), JSON.stringify(row));
  await kv.zadd(ZKEY, { score: scoreForRow(row), member: id });
  return row;
}

export async function updateMercuryRow(
  id: string,
  patch: Partial<Omit<MercuryContentRow, "id">>
): Promise<MercuryContentRow | null> {
  const raw = await kv.get<string>(rowKey(id));
  if (!raw) return null;
  let cur: MercuryContentRow;
  try {
    cur = JSON.parse(raw) as MercuryContentRow;
  } catch {
    return null;
  }
  const next: MercuryContentRow = {
    ...cur,
    ...(patch.category !== undefined ? { category: String(patch.category) } : {}),
    ...(patch.foodName !== undefined ? { foodName: String(patch.foodName) } : {}),
    ...(patch.avgMgKg !== undefined ? { avgMgKg: Number(patch.avgMgKg) } : {}),
    ...(patch.rangeText !== undefined ? { rangeText: String(patch.rangeText) } : {}),
    ...(patch.sampleCount !== undefined
      ? { sampleCount: Math.floor(Number(patch.sampleCount)) }
      : {}),
    ...(patch.analyzedAt !== undefined ? { analyzedAt: String(patch.analyzedAt) } : {}),
    ...(patch.note !== undefined ? { note: String(patch.note) } : {}),
    ...(patch.sourcePostId !== undefined
      ? { sourcePostId: patch.sourcePostId?.trim() || undefined }
      : {}),
  };
  const err = validateMercuryRowInput(next);
  if (err) throw new Error(err);
  const oldScore = scoreForRow(cur);
  const newScore = scoreForRow(next);
  await kv.set(rowKey(id), JSON.stringify(next));
  if (oldScore !== newScore) {
    await kv.zadd(ZKEY, { score: newScore, member: id });
  }
  return next;
}

export async function deleteMercuryRow(id: string): Promise<boolean> {
  const raw = await kv.get(rowKey(id));
  if (!raw) return false;
  await kv.del(rowKey(id));
  await kv.zrem(ZKEY, id);
  return true;
}
