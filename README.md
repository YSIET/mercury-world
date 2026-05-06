# Mercury World (수은세상)

Next.js (App Router) + Supabase 기반의 수은 정보·게시판 사이트 재구축 프로젝트.
현재 단계에서는 기존 PHP 서버 / MySQL 백업이 없어, **DB 백업 없이 동작 가능한
구조**로 구축되어 있다. 향후 백업을 확보하면 `scripts/import-legacy-db.js` 로
이관하면 된다.

> 디자인은 한국 공공/보건 정보 사이트의 일반적 톤(상단 로고 + 글로벌 네비, 좌측
> 서브 네비, 게시판 테이블, 푸터)을 참고한 **오리지널 스타일**이다. 원본 사이트의
> 로고/캐릭터/이미지 등 보호 대상 자산은 포함하지 않으며, 운영자가 직접 교체할
> 수 있도록 자리만 잡혀 있다.

---

## 1. 빠른 시작

```bash
# 1) 의존성 설치
npm install

# 2) 환경변수 설정
cp .env.local.example .env.local
# .env.local 의 값들을 채운다 (아래 5번 참고)

# 3) 개발 서버 실행
npm run dev

# 4) 빌드 확인
npm run build
```

기본 포트는 `http://localhost:3000`.

---

## 2. 디렉터리 구조

```
app/                       # Next.js App Router
  page.tsx                 # 홈
  layout.tsx               # 전역 레이아웃 (헤더/푸터)
  globals.css              # 전역 스타일
  site/greeting/           # 인사말
  mercury/{mercury,cycle,fish,emergency,standard}/
  content/{content,oneday}/
  bbs/[board]/             # 게시판 목록
  bbs/[board]/[id]/        # 게시판 상세
  bbs/[board]/write/       # 사용자 글쓰기 (qna/request/kit)
  admin/                   # 관리자 (login/posts/posts/new/posts/[id]/edit)
  api/                     # 라우트 핸들러
components/                # 공통 React 컴포넌트
lib/                       # 도메인 헬퍼 (supabase, auth, posts, format, ...)
supabase/schema.sql        # DB 스키마 + 시드
scripts/                   # 마이그레이션 / 크롤링 유틸리티
```

---

## 3. 페이지 매핑 (기존 PHP → Next.js)

| 기존 (예시) | 신규 |
|---|---|
| `/index.php` | `/` |
| `/site/greeting.php` | `/site/greeting` |
| `/mercury/mercury.php` | `/mercury/mercury` |
| `/mercury/cycle.php` | `/mercury/cycle` |
| `/mercury/fish.php` | `/mercury/fish` |
| `/mercury/emergency.php` | `/mercury/emergency` |
| `/mercury/standard.php` | `/mercury/standard` |
| `/content/content.php` | `/content/content` |
| `/content/oneday.php` | `/content/oneday` |
| `/bbs/board.php?bo_table=notice` | `/bbs/notice` |
| `/bbs/board.php?bo_table=notice&wr_id=123` | `/bbs/notice/123` |
| `/bbs/write.php?bo_table=qna` | `/bbs/qna/write` |

위 매핑은 `next.config.mjs` 의 `redirects()` / `rewrites()` 에 정의되어 있어,
기존 URL 로 들어오는 트래픽도 새 URL 로 자동 연결된다.

---

## 4. Supabase 준비

1. <https://supabase.com> 에서 프로젝트 생성.
2. `Settings → API` 에서 다음을 복사:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 절대 클라이언트
     공개 금지)
3. SQL Editor 에서 `supabase/schema.sql` 전체 내용을 붙여넣고 실행하면
   `boards`, `posts`, `files`, `admins` 테이블이 생성되고 게시판 시드가 주입된다.
4. (선택) Storage 버킷을 만들어 첨부파일을 업로드하고 그 public URL 을 `files.url`
   에 저장하는 구조를 사용할 수 있다. 외부 URL 을 그대로 넣는 것도 허용된다.

---

## 5. 환경변수

`.env.local` 또는 Vercel 프로젝트의 Environment Variables 에 설정한다.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # 서버 전용
ADMIN_EMAIL=admin@mercury.or.kr
ADMIN_PASSWORD=강력한_비밀번호
ADMIN_SESSION_SECRET=32자_이상_랜덤_문자열
LEGACY_PUBLIC_SITE=https://www.mercury.or.kr   # 크롤러용(옵션)
```

| 변수 | 용도 | 노출 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | 클라이언트 가능 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 익명 SELECT 용 | 클라이언트 가능 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버측 RW (RLS 우회) | **서버 전용** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 관리자 로그인 | 서버 전용 |
| `ADMIN_SESSION_SECRET` | 관리자 세션 JWT 서명 | 서버 전용 |

`SUPABASE_SERVICE_ROLE_KEY` 는 `lib/supabase/admin.ts` 에서만 import 되며,
해당 파일은 `import 'server-only'` 가드로 인해 클라이언트 번들에 포함되지
않는다.

---

## 6. 관리자 계정 설정

1. `.env.local` 또는 Vercel Env 에 `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `ADMIN_SESSION_SECRET` 을 설정한다.
2. `https://<배포주소>/admin/login` 에서 로그인.
3. 관리자가 작성한 글은 `is_admin_post=true` 로 저장되며, **공지로 상단 고정**,
   **비공개로 숨김** 옵션을 체크할 수 있다.
4. 관리자만 비공개 글 본문을 비밀번호 없이 열람 / 수정 / 삭제할 수 있다.

> 향후 다중 관리자 지원: `admins` 테이블에 `email`, `password_hash` (bcrypt) 를
> 추가한 뒤 `lib/auth.ts` 의 `checkAdminCredentials` 를 환경변수 비교 → DB 조회로
> 교체하면 된다. 비밀번호 해시는 `npm run hash-password "내비밀번호"` 로 만든다.

---

## 7. Vercel 배포

1. GitHub 저장소를 Vercel 에서 Import.
2. Framework: **Next.js** (자동 감지).
3. 위 5번의 환경변수를 모두 등록.
4. Deploy.

`vercel.json` 은 따로 두지 않아도 되며, 빌드 명령은 기본값(`next build`) 그대로
사용한다.

---

## 8. 게시판 기능 요약

| 게시판 | 사용자 글쓰기 | 비고 |
|---|---|---|
| `/bbs/notice`  | × | 공지사항 (관리자 전용) |
| `/bbs/news`    | × | 관련 뉴스 |
| `/bbs/mercury` | × | 자료실 |
| `/bbs/qna`     | ✓ | Q&A |
| `/bbs/request` | ✓ | 자료 요청 |
| `/bbs/kit`     | ✓ | 키트 신청 |

공통 기능: 목록 / 검색(제목·내용) / 페이지네이션 / 상세 / 조회수 증가 /
첨부파일 표시 / 비공개 글 / 작성자 비밀번호로 삭제 / 관리자 수정·삭제 /
공지 상단 고정.

---

## 9. 향후 기존 DB 백업을 받았을 때 이관 절차

자세한 내용은 [`migration_notes.md`](./migration_notes.md) 참고.

요약:

1. MySQL dump 또는 그누보드 `g5_write_*`, `g5_board_file` 등을 CSV 로 export.
2. CSV 를 `scripts/legacy-data/` 디렉터리에 저장.
3. 다음과 같이 dry-run 으로 매핑 결과를 확인:
   ```bash
   node scripts/import-legacy-db.js \
     --posts ./scripts/legacy-data/g5_write_notice.csv \
     --files ./scripts/legacy-data/g5_board_file.csv \
     --board notice --dry-run
   ```
4. 문제 없으면 `--dry-run` 을 빼고 실제 인서트.
5. 게시판별로 위 작업을 반복 (`notice`, `news`, `mercury`, `qna`, `request`, `kit`).

`posts.legacy_id` / `posts.legacy_board` 컬럼이 있어 원본과 1:1 매핑이 추적된다.

---

## 10. 현재 가져올 수 없는 기존 데이터

서버 내부 PHP 와 DB 백업이 없는 현재 상태에서는 다음 데이터를 **가져올 수 없다**:

- 비공개 글의 본문 (공개 페이지에서 노출되지 않음)
- 관리자 전용 게시판/메모 (예: `bo_table` 이 공개되지 않은 게시판)
- 회원정보 (`g5_member`) — ID, 이메일, 가입일, 게시글 작성 이력 등
- 그누보드 자체 비밀번호 해시 (포맷이 bcrypt 와 다름)
- 첨부파일 원본 바이너리 (URL 만 보존; 실제 파일은 별도 백업 필요)
- 댓글 (현 스키마에서는 댓글 미지원, 필요 시 `comments` 테이블 추가)
- 조회수, "추천/반대", 포인트 등 그누보드 고유 메타

추후 PHP 서버 백업 또는 mysqldump 를 확보하면 본 프로젝트의
`scripts/import-legacy-db.js` 로 옮길 수 있다. 그 전까지의 차선책으로,
공개 페이지에서 접근 가능한 글만 `scripts/crawl-public-posts.js` 로 JSON
백업을 만들 수 있다.

---

## 11. 자산(이미지·로고) 교체 가이드

본 빌드는 다음 위치에 *오리지널 플레이스홀더*를 사용한다. 원본 사이트의 자산을
사용할 권한이 있다면 다음 위치에서 교체한다:

- `components/SiteHeader.tsx` — 헤더 로고 (`Hg` 텍스트 마크)
- `components/SiteFooter.tsx` — 푸터 로고/문구
- `app/page.tsx` — 홈 히어로 카피
- `app/site/greeting/page.tsx` — 인사말 본문
- `app/mercury/*/page.tsx` — 각 정보 페이지 본문
- `app/content/*/page.tsx` — 콘텐츠/하루 섭취량 본문

실제 이미지를 사용하려면 `public/` 디렉터리에 추가하고 `<Image>` 또는 `<img>` 로
참조한다.
