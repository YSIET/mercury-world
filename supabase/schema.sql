-- Mercury World - Supabase schema
-- Apply with:  psql "<SUPABASE_DB_URL>" -f supabase/schema.sql
-- Or paste into Supabase SQL editor.

-- =========================================================================
-- 1. Boards (게시판 목록)
-- =========================================================================
create table if not exists public.boards (
  slug                text primary key,
  title               text not null,
  description         text,
  allows_user_write   boolean not null default false,
  display_order       int not null default 0,
  created_at          timestamptz not null default now()
);

-- =========================================================================
-- 2. Posts (게시글)
--   - is_admin_post: 관리자가 작성한 글 (작성자 비밀번호 없음)
--   - author_password_hash: 비관리자 글의 수정/삭제 검증용 (bcrypt)
--   - is_private: 비공개 글 (목록에는 제목만 노출, 본문은 비밀번호/관리자만 열람)
--   - is_notice: 공지 (상단 고정)
--   - legacy_id / legacy_board: 추후 기존 DB 이관 시 매핑용
-- =========================================================================
create table if not exists public.posts (
  id                    bigserial primary key,
  board_slug            text not null references public.boards(slug) on delete restrict,
  title                 text not null,
  content               text not null default '',
  author_name           text,
  author_password_hash  text,
  is_admin_post         boolean not null default false,
  is_notice             boolean not null default false,
  is_private            boolean not null default false,
  views                 integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  legacy_id             text,
  legacy_board          text
);

create index if not exists posts_board_slug_idx
  on public.posts (board_slug);
create index if not exists posts_board_created_idx
  on public.posts (board_slug, is_notice desc, created_at desc);
create index if not exists posts_legacy_idx
  on public.posts (legacy_board, legacy_id);

-- =========================================================================
-- 3. Files (첨부파일)
--   url 은 Supabase Storage public URL 또는 외부 URL 모두 허용.
-- =========================================================================
create table if not exists public.files (
  id            bigserial primary key,
  post_id       bigint not null references public.posts(id) on delete cascade,
  filename      text not null,
  url           text not null,
  size_bytes    bigint,
  content_type  text,
  download_count integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists files_post_idx on public.files (post_id);

-- =========================================================================
-- 4. Admins (관리자 계정 — 향후 다중 관리자 지원용)
--   현재 1차 구현은 환경변수 ADMIN_EMAIL/ADMIN_PASSWORD 로 인증한다.
--   필요 시 이 테이블의 행으로 확장 가능. password_hash 는 bcrypt.
-- =========================================================================
create table if not exists public.admins (
  id            bigserial primary key,
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- =========================================================================
-- Seed boards
-- =========================================================================
insert into public.boards (slug, title, description, allows_user_write, display_order) values
  ('notice',  '공지사항',     '수은세상의 공지사항을 안내합니다.',          false, 1),
  ('news',    '관련 뉴스',     '수은 관련 언론 보도 및 뉴스 모음.',          false, 2),
  ('mercury', '수은 자료실',   '수은 관련 자료, 보고서, 가이드라인.',         false, 3),
  ('qna',     'Q&A',           '수은과 관련해 궁금한 점을 질문해 주세요.',     true,  4),
  ('request', '자료 요청',     '수은 자료 요청 및 문의를 남겨주세요.',         true,  5),
  ('kit',     '키트 신청',     '수은 검사 키트 신청 게시판입니다.',           true,  6)
on conflict (slug) do update
  set title = excluded.title,
      description = excluded.description,
      allows_user_write = excluded.allows_user_write,
      display_order = excluded.display_order;

-- =========================================================================
-- 5. RLS
-- 본 프로젝트는 service-role key 를 통해 서버에서만 DB 쓰기를 수행한다.
-- anon key 는 공개 게시판 SELECT 용도로 사용한다.
-- 따라서 RLS 를 켜고 anon 에게는 SELECT 만 허용한다.
-- =========================================================================
alter table public.boards  enable row level security;
alter table public.posts   enable row level security;
alter table public.files   enable row level security;
alter table public.admins  enable row level security;

drop policy if exists "boards readable" on public.boards;
create policy "boards readable" on public.boards
  for select using (true);

drop policy if exists "posts readable" on public.posts;
create policy "posts readable" on public.posts
  for select using (true);  -- 비공개 본문 마스킹은 애플리케이션 계층에서 처리

drop policy if exists "files readable" on public.files;
create policy "files readable" on public.files
  for select using (true);

-- admins 테이블은 anon 접근 차단 (정책 없음 = 거부)
