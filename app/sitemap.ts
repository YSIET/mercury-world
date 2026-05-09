import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site-canonical";
import {
  listAllKvBoardPosts,
  listPathForBoardType,
  publicBoardListId,
  type BoardType,
} from "@/lib/board";
import { listAllPosts } from "@/lib/qna";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/site/greeting", changeFrequency: "monthly", priority: 0.7 },
  { path: "/content/content", changeFrequency: "monthly", priority: 0.7 },
  { path: "/content/mercury", changeFrequency: "monthly", priority: 0.7 },
  { path: "/content/one", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mercury/mercury", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mercury/mercury_cycle", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mercury/fish", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mercury/emergency", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mercury/regulation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/community/freeboard", changeFrequency: "daily", priority: 0.85 },
  { path: "/community/kit", changeFrequency: "monthly", priority: 0.7 },
  { path: "/community/request", changeFrequency: "monthly", priority: 0.7 },
  { path: "/news/board", changeFrequency: "daily", priority: 0.85 },
  { path: "/news/news", changeFrequency: "daily", priority: 0.85 },
  { path: "/news/pds", changeFrequency: "weekly", priority: 0.85 },
  { path: "/test/q", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sitemap", changeFrequency: "monthly", priority: 0.5 },
];

const BOARD_TYPES: BoardType[] = ["notice", "news", "pds"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_ORIGIN}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  for (const type of BOARD_TYPES) {
    const posts = await listAllKvBoardPosts(type);
    const base = listPathForBoardType(type);
    for (const p of posts) {
      out.push({
        url: `${SITE_ORIGIN}${base}/${publicBoardListId(p)}`,
        lastModified: new Date(p.updatedAt || p.createdAt),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  const qnaPosts = await listAllPosts();
  for (const p of qnaPosts) {
    const pubId = p.legacyBdNo ?? p.id;
    out.push({
      url: `${SITE_ORIGIN}/community/freeboard/${pubId}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly",
      priority: 0.55,
    });
  }

  return out;
}
