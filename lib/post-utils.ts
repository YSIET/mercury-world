/** Pure helpers (no JSON data imports). */

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10).replace(/-/g, ".");
}

export function listPathForSlug(slug: string): string {
  const m: Record<string, string> = {
    notice: "/news/board",
    news: "/news/news",
    pds: "/news/pds",
    freeboard: "/community/freeboard",
  };
  return m[slug] ?? "/";
}

/** Cafe24 export / 글 본문이 HTML 태그를 포함하는지 휴리스틱 */
export function contentUsesHtml(content: string): boolean {
  return /<\s*[a-zA-Z!?/]/.test(content);
}

/** 메타 description용 — 태그 제거 후 길이 제한 */
export function plainTextExcerpt(htmlOrText: string, maxLen: number): string {
  const stripped = htmlOrText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= maxLen) return stripped;
  return `${stripped.slice(0, Math.max(0, maxLen - 1))}…`;
}
