#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/crawl-public-posts.js
 *
 * 공개 사이트(예: https://www.mercury.or.kr)의 공개 게시글 목록·상세를
 * JSON 으로 백업하기 위한 골격 스크립트.
 *
 * 사용 예:
 *   LEGACY_PUBLIC_SITE=https://www.mercury.or.kr \
 *     node scripts/crawl-public-posts.js --board notice --pages 5
 *
 * 옵션:
 *   --board <slug>      대상 게시판 (notice|news|mercury|qna|request|kit)
 *   --pages <n>         크롤할 최대 페이지 수 (기본 1)
 *   --out <path>        결과 JSON 저장 경로 (기본 scripts/output/<board>.json)
 *
 * 본 스크립트는 사이트 구조에 의존하므로, 실제 페이지의 HTML 셀렉터에 맞게
 * extractList / extractDetail 함수를 보정한 후 사용해야 한다.
 *
 * 주의:
 *   - robots.txt 와 사이트 운영자의 동의를 반드시 확인할 것
 *   - 비공개·관리자 전용 글, 회원정보, 첨부파일 원본은 가져올 수 없음
 *   - 결과 JSON 은 향후 import-legacy-db.js 의 입력으로 사용 가능
 */

const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.LEGACY_PUBLIC_SITE ?? 'https://www.mercury.or.kr';
const VALID_BOARDS = ['notice', 'news', 'mercury', 'qna', 'request', 'kit'];

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? def : process.argv[i + 1];
}

const BOARD = arg('board');
const PAGES = parseInt(arg('pages', '1'), 10) || 1;
const OUT   = arg('out');

if (!BOARD || !VALID_BOARDS.includes(BOARD)) {
  console.error(`--board 누락. 가능: ${VALID_BOARDS.join(', ')}`);
  process.exit(1);
}

const outPath = OUT ?? path.join(process.cwd(), 'scripts', 'output', `${BOARD}.json`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'mercury-world-backup-crawler/1.0',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

/**
 * 페이지 HTML 에서 (id, title, author, date) 리스트를 뽑는다.
 * 실제 사이트 구조에 맞춰 정규식/선택자를 보정해야 한다.
 * 아래는 그누보드(GNUBOARD) 기본 테이블 구조 가정 예시.
 */
function extractList(html) {
  const rows = [];
  const re = /<tr[^>]*class="[^"]*bo_tbl[^"]*"[\s\S]*?<\/tr>/g;
  // NOTE: 위 정규식은 예시이며, 실제 HTML 에서는 board_table 구조가 다를 수 있다.
  // tail-call: 본 빌드에서는 빈 배열을 반환하고, 사이트별 구조 확인 후 셀렉터를 조정하라.
  void re;
  void html;
  return rows;
}

function extractDetail(html) {
  // 실제 페이지의 .view_subject / .view_content 등 클래스에 맞게 조정.
  void html;
  return { title: '', content: '', author: '', date: '', views: 0, files: [] };
}

async function crawlBoard(board, pages) {
  const collected = [];
  for (let page = 1; page <= pages; page++) {
    const listUrl = `${BASE}/bbs/board.php?bo_table=${board}&page=${page}`;
    console.log(`[crawl] LIST ${listUrl}`);
    let listHtml = '';
    try {
      listHtml = await fetchText(listUrl);
    } catch (e) {
      console.warn(`[crawl] list fetch failed: ${e.message}`);
      continue;
    }
    const items = extractList(listHtml);
    if (items.length === 0) {
      console.log('[crawl] no items extracted on this page (check selectors).');
    }
    for (const item of items) {
      const detailUrl = `${BASE}/bbs/board.php?bo_table=${board}&wr_id=${item.id}`;
      try {
        const detailHtml = await fetchText(detailUrl);
        const detail = extractDetail(detailHtml);
        collected.push({
          legacy_id: String(item.id),
          legacy_board: board,
          title: detail.title || item.title,
          author: detail.author || item.author,
          created_at: detail.date || item.date,
          views: detail.views ?? 0,
          content: detail.content ?? '',
          files: detail.files ?? [],
          source_url: detailUrl,
        });
      } catch (e) {
        console.warn(`[crawl] detail fetch failed (id=${item.id}): ${e.message}`);
      }
    }
  }
  return collected;
}

(async () => {
  console.log(`[crawl] base=${BASE} board=${BOARD} pages=${PAGES}`);
  const data = await crawlBoard(BOARD, PAGES);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[crawl] saved ${data.length} posts -> ${outPath}`);
  console.log('[crawl] NOTE: extractList / extractDetail 셀렉터를 실제 사이트 구조에 맞춰 조정해야 합니다.');
})();
