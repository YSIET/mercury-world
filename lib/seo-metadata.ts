import type { Metadata } from "next";
import {
  boardSectionHeading,
  listPathForBoardType,
  publicBoardListId,
  resolveBoardPost,
  type BoardType,
} from "@/lib/board";
import { plainTextExcerpt } from "@/lib/post-utils";

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
  return {
    title: post.title,
    description: desc,
    openGraph: {
      title: `${post.title} — ${section}`,
      description: desc,
      url: path,
    },
    twitter: {
      title: `${post.title} — ${section}`,
      description: desc,
    },
  };
}
