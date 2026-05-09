/** Public site origin (must match sitemap, og:url, canonical). */
export const SITE_ORIGIN = "https://www.mercury.or.kr";

/** Full canonical URL for the current request path (no trailing slash on home). */
export function canonicalFromPathname(pathname: string | null | undefined): string {
  const p = pathname && pathname.length > 0 ? pathname : "/";
  if (p === "/" || p === "") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${p.startsWith("/") ? p : `/${p}`}`;
}
