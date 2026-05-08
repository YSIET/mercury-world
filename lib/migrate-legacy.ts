import type { Post } from "@/lib/posts";
import { getPostsByBoard } from "@/lib/posts";
import {
  attachmentBoardIdForType,
  type BoardAttachment,
  type BoardPost,
  type BoardType,
  deleteKvPost,
  getKvPost,
  getLegacyViewExtra,
  saveNewKvPost,
} from "@/lib/board";
import { attachmentUrl, getAttachmentsFor } from "@/lib/attachments";
import {
  hashPassword,
  getPost,
  migratedFreeboardKvId,
  saveMigratedQnaPost,
  type QnaPost,
} from "@/lib/qna";

const BOARD_TYPES: BoardType[] = ["notice", "news", "pds"];

export type MigrateLegacyResult = {
  ok: boolean;
  dryRun: boolean;
  migrated: { notice: number; news: number; pds: number; freeboard: number };
  skipped: { notice: number; news: number; pds: number; freeboard: number };
  errors: string[];
  samples?: {
    notice?: Pick<Post, "title" | "legacy_bd_no">;
    news?: Pick<Post, "title" | "legacy_bd_no">;
    pds?: Pick<Post, "title" | "legacy_bd_no">;
    freeboard?: Pick<Post, "title" | "legacy_bd_no">;
  };
};

function boardAttachments(
  type: BoardType,
  post: Post
): BoardAttachment[] | undefined {
  const bid = attachmentBoardIdForType(type);
  if (!bid) return undefined;
  const raw = getAttachmentsFor(bid, post.legacy_bd_no);
  if (!raw.length) return undefined;
  return raw.map((a) => ({
    name: a.real_name,
    url: attachmentUrl(bid, a.save_name),
  }));
}

function legacyBoardMember(legacyBdNo: number): string {
  return `legacy:${legacyBdNo}`;
}

async function migrateBoardType(
  type: BoardType,
  posts: Post[],
  opts: { dryRun: boolean; overwrite: boolean },
  counts: { migrated: number; skipped: number }
): Promise<string[]> {
  const errors: string[] = [];
  for (const post of posts) {
    const member = legacyBoardMember(post.legacy_bd_no);
    try {
      const exists = await getKvPost(type, member);
      if (exists && !opts.overwrite) {
        counts.skipped++;
        continue;
      }
      const extra = opts.dryRun ? 0 : await getLegacyViewExtra(type, post.legacy_bd_no);
      const views = post.hit_count + (Number.isFinite(extra) ? extra : 0);
      const attachments = boardAttachments(type, post);
      const created = post.created_at?.trim()
        ? post.created_at
        : new Date(0).toISOString();
      const bp: BoardPost = {
        id: member,
        type,
        title: post.title,
        content: post.content,
        author: post.author_name?.trim() || "수은세상",
        createdAt: created,
        updatedAt: created,
        views,
        attachments,
        isNotice: post.is_notice,
      };
      if (opts.dryRun) {
        counts.migrated++;
        continue;
      }
      if (exists && opts.overwrite) {
        await deleteKvPost(type, member);
      }
      await saveNewKvPost(bp);
      counts.migrated++;
    } catch (e) {
      errors.push(`${type} legacy_bd_no=${post.legacy_bd_no}: ${String(e)}`);
    }
  }
  return errors;
}

async function migrateFreeboard(
  posts: Post[],
  opts: { dryRun: boolean; overwrite: boolean },
  legacyPasswordHash: string,
  counts: { migrated: number; skipped: number }
): Promise<string[]> {
  const errors: string[] = [];
  const sorted = [...posts].sort((a, b) => a.thread_depth - b.thread_depth);
  for (const post of sorted) {
    const id = migratedFreeboardKvId(post.legacy_bd_no);
    try {
      const exists = await getPost(id);
      if (exists && !opts.overwrite) {
        counts.skipped++;
        continue;
      }
      const createdAt = post.created_at?.trim()
        ? Date.parse(post.created_at)
        : 0;
      const nowTs = Number.isFinite(createdAt) ? createdAt : 0;

      const q: QnaPost = {
        id,
        title: post.title,
        content: post.content,
        name: post.author_name?.trim() || "수은세상",
        email: post.author_email?.trim() || undefined,
        passwordHash: legacyPasswordHash,
        isSecret: post.has_secret,
        createdAt: nowTs,
        updatedAt: nowTs,
        depth: post.thread_depth ?? 0,
        legacyBdNo: post.legacy_bd_no,
      };
      if (post.thread_parent > 0) {
        q.parentId = migratedFreeboardKvId(post.thread_parent);
        q.rootId =
          post.thread_root > 0
            ? migratedFreeboardKvId(post.thread_root)
            : q.parentId;
      }

      if (opts.dryRun) {
        counts.migrated++;
        continue;
      }
      if (exists && opts.overwrite) {
        const { deletePostById } = await import("@/lib/qna");
        await deletePostById(id);
      }
      await saveMigratedQnaPost(q);
      counts.migrated++;
    } catch (e) {
      errors.push(`freeboard legacy_bd_no=${post.legacy_bd_no}: ${String(e)}`);
    }
  }
  return errors;
}

export async function migrateLegacyToKv(opts: {
  dryRun?: boolean;
  overwrite?: boolean;
}): Promise<MigrateLegacyResult> {
  const dryRun = !!opts.dryRun;
  const overwrite = !!opts.overwrite;

  const migrated = { notice: 0, news: 0, pds: 0, freeboard: 0 };
  const skipped = { notice: 0, news: 0, pds: 0, freeboard: 0 };
  const errors: string[] = [];

  const noticePosts = getPostsByBoard("notice");
  const newsPosts = getPostsByBoard("news");
  const pdsPosts = getPostsByBoard("pds");
  const freePosts = getPostsByBoard("freeboard");

  const samples = {
    notice: noticePosts[0]
      ? { title: noticePosts[0]!.title, legacy_bd_no: noticePosts[0]!.legacy_bd_no }
      : undefined,
    news: newsPosts[0]
      ? { title: newsPosts[0]!.title, legacy_bd_no: newsPosts[0]!.legacy_bd_no }
      : undefined,
    pds: pdsPosts[0]
      ? { title: pdsPosts[0]!.title, legacy_bd_no: pdsPosts[0]!.legacy_bd_no }
      : undefined,
    freeboard: freePosts[0]
      ? { title: freePosts[0]!.title, legacy_bd_no: freePosts[0]!.legacy_bd_no }
      : undefined,
  };

  if (dryRun) {
    console.log("[migrate-legacy] DRY RUN", {
      notice: noticePosts.length,
      news: newsPosts.length,
      pds: pdsPosts.length,
      freeboard: freePosts.length,
      samples,
    });
  }

  const legacyPasswordHash = dryRun
    ? ""
    : await hashPassword("__MERCURY_LEGACY_IMPORT_V1__");

  for (const type of BOARD_TYPES) {
    const posts =
      type === "notice"
        ? noticePosts
        : type === "news"
          ? newsPosts
          : pdsPosts;
    const bucket = { migrated: 0, skipped: 0 };
    const err = await migrateBoardType(type, posts, { dryRun, overwrite }, bucket);
    errors.push(...err);
    migrated[type] = bucket.migrated;
    skipped[type] = bucket.skipped;
  }

  const fbBucket = { migrated: 0, skipped: 0 };
  const fbErr = await migrateFreeboard(
    freePosts,
    { dryRun, overwrite },
    legacyPasswordHash,
    fbBucket
  );
  errors.push(...fbErr);
  migrated.freeboard = fbBucket.migrated;
  skipped.freeboard = fbBucket.skipped;

  return {
    ok: errors.length === 0,
    dryRun,
    migrated,
    skipped,
    errors,
    samples,
  };
}
