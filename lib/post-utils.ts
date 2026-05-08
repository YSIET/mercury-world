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
