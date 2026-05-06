# Migration Notes — 기존 mercury.or.kr → Supabase 이관

본 문서는 **현재 서버 PHP 원본과 DB 백업을 확보하지 못한 상태**에서, 향후
백업이 확보되었을 때 이관을 위해 미리 잡아둔 설계 메모이다.

---

## 1. 현재 시점의 한계

| 데이터 | 가져올 수 있나? | 메모 |
|---|---|---|
| 공개 게시글(목록·상세) | △ (크롤링 한정) | `scripts/crawl-public-posts.js` 로 JSON 백업 가능. 단, 사이트 셀렉터에 맞춰 함수 수정 필요. |
| 공개 첨부파일 URL    | △ (크롤링 한정) | URL 만 추출 가능. 실제 바이너리는 별도 다운로드. |
| 비공개 글 본문        | × | 공개 페이지에 노출되지 않음. DB 백업 확보 후에만 이관 가능. |
| 관리자 메모/내부 게시판 | × | 동일. |
| 회원정보(g5_member)   | × | DB 백업 필요. |
| 비밀번호 해시         | × | 그누보드 해시(MD5/PHP password_hash) 와 본 프로젝트 bcrypt 가 호환되지 않음. **재설정 필요**. |
| 댓글                 | × | 현 스키마에서 미구현. 필요 시 `comments` 테이블을 추가. |
| 조회수, 추천/포인트   | △ | 조회수는 보존 가능. 추천/포인트는 본 스키마에 컬럼 없음(필요 시 확장). |

---

## 2. 이관 단계 (백업 확보 후)

### 단계 A — 백업 파일 표준화

다음 형식 중 하나로 정리한다(스크립트가 읽는 입력은 CSV 기준):

- 그누보드 5 `g5_write_*` 테이블 → CSV (예: `g5_write_notice.csv`)
- 그누보드 5 `g5_board_file` 테이블 → CSV
- 그 외 형태(JSON, XLSX) 라면 우선 CSV 로 변환

CSV 헤더 예 (그누보드 5 기준 일부):

```
wr_id,wr_subject,wr_content,wr_name,wr_password,wr_datetime,wr_hit,wr_notice,wr_secret,bo_table
```

첨부파일:

```
wr_id,bf_source,bf_url,bf_filesize,bf_content_type
```

### 단계 B — Dry run

```bash
node scripts/import-legacy-db.js \
  --posts ./scripts/legacy-data/g5_write_notice.csv \
  --files ./scripts/legacy-data/g5_board_file.csv \
  --board notice \
  --dry-run
```

매핑된 첫 행을 출력해 컬럼 매핑이 올바른지 확인한다.

### 단계 C — 실제 인서트

```bash
node scripts/import-legacy-db.js \
  --posts ./scripts/legacy-data/g5_write_notice.csv \
  --files ./scripts/legacy-data/g5_board_file.csv \
  --board notice
```

게시판별로 반복 (`notice`, `news`, `mercury`, `qna`, `request`, `kit`).

### 단계 D — 검증

- `posts.legacy_board`, `posts.legacy_id` 로 원본과 1:1 매핑 확인.
- 공개 페이지에서 게시판 표시·정렬 점검.
- 비공개 글의 비밀번호는 무효화되어 있으므로, 사용자에게 안내 후 재설정 유도
  (또는 관리자 직접 수정).

---

## 3. 매핑 규칙

| 원본 (그누보드) | 신규 (Supabase) | 변환 |
|---|---|---|
| `wr_subject` | `posts.title` | trim |
| `wr_content` | `posts.content` | HTML → 그대로 저장(필요 시 sanitize) |
| `wr_name` | `posts.author_name` | trim |
| `wr_password` | `posts.author_password_hash` | **무시** (해시 형식 비호환). 재설정 안내. |
| `wr_datetime` | `posts.created_at` | `new Date(...).toISOString()` |
| `wr_hit` | `posts.views` | parseInt |
| `wr_notice` | `posts.is_notice` | `1`이면 true |
| `wr_secret` | `posts.is_private` | `1`이면 true |
| `bo_table` | `posts.legacy_board` | 그대로 |
| `wr_id` | `posts.legacy_id` | 문자열로 저장 |
| `bf_source` | `files.filename` | 그대로 |
| `bf_url` | `files.url` | 외부 URL 그대로 사용 가능 |
| `bf_filesize` | `files.size_bytes` | parseInt |

---

## 4. 첨부파일 바이너리 보존

URL 만 옮겨도 동작하지만, 원본 서버가 폐기되면 링크가 깨진다. 권장 절차:

1. 원본 서버에서 첨부파일 디렉터리(`data/file/<board>`)를 별도 백업.
2. Supabase Storage 에 동일한 경로로 업로드 후 public URL 생성.
3. CSV 의 `bf_url` 을 새 public URL 로 일괄 치환한 뒤 import 실행.

---

## 5. 미정 / 향후 검토

- **댓글 시스템**: 현재 스키마에 `comments` 테이블이 없다. 필요 시 다음을 추가:
  ```sql
  create table public.comments (
    id bigserial primary key,
    post_id bigint not null references posts(id) on delete cascade,
    author_name text,
    author_password_hash text,
    content text not null,
    is_admin_comment boolean not null default false,
    is_private boolean not null default false,
    created_at timestamptz not null default now()
  );
  ```
- **회원 시스템**: 현재 사용자 글쓰기는 비회원(이름 + 1회용 비밀번호) 방식.
  필요 시 Supabase Auth 로 확장 가능.
- **조회수 동시성**: 현재는 read-then-write 로 단순 구현. 트래픽이 늘면
  `posts_increment_views(post_id bigint)` 같은 PL/pgSQL 함수로 옮긴다.
