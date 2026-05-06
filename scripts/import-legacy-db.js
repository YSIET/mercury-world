#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/import-legacy-db.js
 *
 * 기존 mercury.or.kr (그누보드 / PHP+MySQL) DB 백업을 받았을 때
 * Supabase 의 posts/files 테이블로 이관하는 스크립트의 골격이다.
 *
 * 현재는 백업 파일이 없으므로 이 스크립트는 "구조만" 제공한다.
 * 실제 백업 파일을 받으면 아래 readLegacy* 함수들을 채워 넣으면 된다.
 *
 * 입력 형식 후보:
 *   1) MySQL dump (.sql)
 *   2) CSV (write/file 별 1개씩)
 *   3) JSON (그누보드 API 백업)
 *
 * 환경 변수:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * 사용 예:
 *   node scripts/import-legacy-db.js \
 *     --posts ./scripts/legacy-data/posts.csv \
 *     --files ./scripts/legacy-data/files.csv \
 *     --board notice \
 *     --dry-run
 */

const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

function arg(name, def = undefined) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  return process.argv[idx + 1];
}
const FLAG = (name) => process.argv.includes(`--${name}`);

const POSTS_PATH = arg('posts');
const FILES_PATH = arg('files');
const BOARD     = arg('board');
const DRY_RUN   = FLAG('dry-run');

const VALID_BOARDS = ['notice', 'news', 'mercury', 'qna', 'request', 'kit'];

function readCsv(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return [];
  }
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = parseCsvRow(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvRow(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = cells[i] ?? ''; });
    return row;
  });
}

// Minimal RFC4180-ish parser (handles quoted commas + escaped quotes)
function parseCsvRow(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cur += ch; }
    } else {
      if (ch === ',') { out.push(cur); cur = ''; }
      else if (ch === '"') { inQuotes = true; }
      else { cur += ch; }
    }
  }
  out.push(cur);
  return out;
}

/**
 * 그누보드 wr_* 컬럼을 우리 posts 컬럼으로 매핑한다.
 *   wr_id, wr_subject, wr_content, wr_name, wr_datetime, wr_hit, wr_password, ...
 */
function mapLegacyPostRow(legacy, board) {
  const subject  = legacy.wr_subject ?? legacy.subject ?? legacy.title ?? '';
  const content  = legacy.wr_content ?? legacy.content ?? '';
  const name     = legacy.wr_name    ?? legacy.author  ?? null;
  const datetime = legacy.wr_datetime ?? legacy.created_at ?? null;
  const views    = parseInt(legacy.wr_hit ?? legacy.views ?? '0', 10) || 0;
  const isNotice = String(legacy.wr_notice ?? legacy.is_notice ?? '').match(/^(1|true|yes)$/i) ? true : false;
  const isPrivate = String(legacy.wr_secret ?? legacy.is_private ?? '').match(/^(1|true|yes)$/i) ? true : false;
  // 기존 비밀번호는 그누보드 자체 해시(MD5/PHP password_hash) 가 다를 수 있어
  // bcrypt 와 호환되지 않으므로 author_password_hash 는 비워두고
  // legacy_password_hash 메모만 남긴다. (필요 시 재설정 안내 메일 발송)
  return {
    board_slug: board,
    title: subject,
    content,
    author_name: name,
    author_password_hash: null,
    is_admin_post: false,
    is_notice: isNotice,
    is_private: isPrivate,
    views,
    created_at: datetime ? new Date(datetime).toISOString() : new Date().toISOString(),
    legacy_id: String(legacy.wr_id ?? legacy.id ?? ''),
    legacy_board: legacy.bo_table ?? board,
  };
}

function mapLegacyFileRow(legacy) {
  return {
    legacy_post_id: String(legacy.wr_id ?? legacy.post_id ?? ''),
    filename: legacy.bf_source ?? legacy.filename ?? legacy.file_name ?? '',
    url: legacy.bf_url ?? legacy.url ?? legacy.file_url ?? '',
    size_bytes: parseInt(legacy.bf_filesize ?? legacy.size_bytes ?? '0', 10) || null,
    content_type: legacy.bf_content_type ?? null,
  };
}

async function main() {
  if (!BOARD || !VALID_BOARDS.includes(BOARD)) {
    console.error(`--board 가 누락되었거나 잘못되었습니다. 가능한 값: ${VALID_BOARDS.join(', ')}`);
    process.exit(1);
  }
  if (!POSTS_PATH) {
    console.error('--posts <csv 경로> 가 필요합니다.');
    process.exit(1);
  }
  console.log(`[import-legacy-db] board=${BOARD} dry-run=${DRY_RUN}`);
  console.log(`[import-legacy-db] posts file: ${POSTS_PATH}`);
  if (FILES_PATH) console.log(`[import-legacy-db] files file: ${FILES_PATH}`);

  const legacyPosts = readCsv(POSTS_PATH);
  const legacyFiles = readCsv(FILES_PATH);

  console.log(`[import-legacy-db] parsed posts: ${legacyPosts.length}`);
  console.log(`[import-legacy-db] parsed files: ${legacyFiles.length}`);

  const mappedPosts = legacyPosts.map((p) => mapLegacyPostRow(p, BOARD));
  const mappedFiles = legacyFiles.map(mapLegacyFileRow);

  if (DRY_RUN) {
    console.log('[import-legacy-db] DRY RUN — sample mapped post:');
    console.log(JSON.stringify(mappedPosts[0] ?? {}, null, 2));
    console.log('[import-legacy-db] DRY RUN — sample mapped file:');
    console.log(JSON.stringify(mappedFiles[0] ?? {}, null, 2));
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다.');
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const BATCH = 200;
  for (let i = 0; i < mappedPosts.length; i += BATCH) {
    const slice = mappedPosts.slice(i, i + BATCH);
    const { data, error } = await sb
      .from('posts')
      .insert(slice)
      .select('id, legacy_id');
    if (error) {
      console.error('insert posts error:', error.message);
      process.exit(1);
    }
    // attach files using returned (id, legacy_id) mapping
    const idByLegacy = new Map(data.map((d) => [String(d.legacy_id), d.id]));
    const filesToInsert = mappedFiles
      .filter((f) => idByLegacy.has(String(f.legacy_post_id)))
      .map((f) => ({
        post_id: idByLegacy.get(String(f.legacy_post_id)),
        filename: f.filename,
        url: f.url,
        size_bytes: f.size_bytes,
        content_type: f.content_type,
      }));
    if (filesToInsert.length) {
      const { error: fErr } = await sb.from('files').insert(filesToInsert);
      if (fErr) {
        console.error('insert files error:', fErr.message);
      }
    }
    console.log(`[import-legacy-db] inserted ${i + slice.length}/${mappedPosts.length}`);
  }
  console.log('[import-legacy-db] done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
