import Link from 'next/link';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { BOARDS } from '@/lib/boards';
import { formatDate } from '@/lib/format';
import type { PostListItem } from '@/lib/types';

export const revalidate = 60;

interface BoardPreview {
  slug: string;
  title: string;
  posts: PostListItem[];
}

async function loadPreviews(): Promise<BoardPreview[]> {
  try {
    const sb = getAdminSupabase();
    const { data } = await sb
      .from('posts')
      .select('id,board_slug,title,author_name,is_admin_post,is_notice,is_private,views,created_at')
      .in('board_slug', ['notice', 'news', 'mercury', 'qna'])
      .order('created_at', { ascending: false })
      .limit(40);

    const grouped: Record<string, PostListItem[]> = {};
    for (const row of (data ?? []) as PostListItem[]) {
      grouped[row.board_slug] ??= [];
      if (grouped[row.board_slug].length < 5) grouped[row.board_slug].push(row);
    }

    return (['notice', 'news', 'mercury', 'qna'] as const).map((slug) => ({
      slug,
      title: BOARDS[slug].title,
      posts: grouped[slug] ?? [],
    }));
  } catch {
    // Supabase not configured yet — render empty placeholders.
    return (['notice', 'news', 'mercury', 'qna'] as const).map((slug) => ({
      slug,
      title: BOARDS[slug].title,
      posts: [],
    }));
  }
}

const FEATURES = [
  { icon: 'Hg', title: '수은이란?', desc: '수은의 기본 성질과 형태를 알아봅니다.', href: '/mercury/mercury' },
  { icon: '↻', title: '수은의 순환', desc: '환경 속 수은의 이동 경로.', href: '/mercury/cycle' },
  { icon: '🐟', title: '어류 속 수은', desc: '식품으로 섭취되는 수은 정보.', href: '/mercury/fish' },
  { icon: '⚠', title: '응급처치', desc: '수은 누출·노출 시 대처 방법.', href: '/mercury/emergency' },
];

export default async function HomePage() {
  const previews = await loadPreviews();
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">수은세상</h1>
          <p className="hero__subtitle">
            일상 속 수은을 바르게 이해하고, 우리 가족의 건강을 지키는 정보를
            한곳에서 만나보세요.
          </p>
          <Link href="/mercury/mercury" className="hero__cta">
            수은 알아보기 →
          </Link>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2 className="home-section__title">
            주요 안내
            <Link href="/site/greeting">사이트 소개 →</Link>
          </h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href} className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">{f.icon}</span>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#fff', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <h2 className="home-section__title">
            최근 게시글
            <Link href="/bbs/notice">게시판으로 →</Link>
          </h2>
          <div className="home-boards">
            {previews.map((p) => (
              <div key={p.slug} className="home-board">
                <div className="home-board__head">
                  <h3>{p.title}</h3>
                  <Link href={`/bbs/${p.slug}`}>더보기</Link>
                </div>
                {p.posts.length === 0 ? (
                  <p className="muted" style={{ margin: '12px 0' }}>등록된 글이 없습니다.</p>
                ) : (
                  <ul className="home-board__list">
                    {p.posts.map((post) => (
                      <li key={post.id}>
                        <Link href={`/bbs/${p.slug}/${post.id}`}>
                          {post.is_private ? '비공개 글입니다.' : post.title}
                        </Link>
                        <span className="home-board__date">{formatDate(post.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
