import type { Metadata } from "next";
import {
  boardSectionHeading,
  listPathForBoardType,
  publicBoardListId,
  resolveBoardPost,
  type BoardType,
} from "@/lib/board";
import { plainTextExcerpt } from "@/lib/post-utils";
import { canonicalFromPathname } from "@/lib/site-canonical";

export async function boardPostMetadata(
  boardType: BoardType,
  id: string
): Promise<Metadata> {
  const resolved = await resolveBoardPost(boardType, id);
  if (!resolved) {
    return { title: boardSectionHeading(boardType) };
  }
  const { post } = resolved;
  const desc = plainTextExcerpt(post.content, 160);
  const section = boardSectionHeading(boardType);
  const path = `${listPathForBoardType(boardType)}/${publicBoardListId(post)}`;
  const canonical = canonicalFromPathname(path);
  return {
    title: post.title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${post.title} — ${section}`,
      description: desc,
      url: canonical,
    },
    twitter: {
      title: `${post.title} — ${section}`,
      description: desc,
    },
  };
}
