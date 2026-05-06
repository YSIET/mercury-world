'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatBytes, formatDateTime } from '@/lib/format';
import type { PostDetail } from '@/lib/types';

interface Props {
  post: PostDetail;
  boardBasePath: string;
  isAdmin: boolean;
  isPrivateLocked: boolean;
  allowsUserWrite: boolean;
}

export default function PostDetailView({
  post,
  boardBasePath,
  isAdmin,
  isPrivateLocked,
  allowsUserWrite,
}: Props) {
  const router = useRouter();
  const [pwInput, setPwInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'unlock' | 'delete' | null>(null);
  const [unlockedHtml, setUnlockedHtml] = useState<{
    content: string;
    files: PostDetail['files'];
  } | null>(null);

  async function unlockPrivate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy('unlock');
    try {
      const res = await fetch(`/api/bbs/post/${post.id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwInput }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? '비밀번호가 일치하지 않습니다.');
      }
      setUnlockedHtml({ content: json.post.content, files: json.post.files ?? [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    if (!isAdmin) {
      const password = window.prompt('작성 시 입력한 비밀번호를 입력해 주세요.');
      if (password == null) return;
      if (!password) return;
      setBusy('delete');
      try {
        const res = await fetch(`/api/bbs/post/${post.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error ?? '삭제 실패');
        router.push(boardBasePath);
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : '오류');
      } finally {
        setBusy(null);
      }
      return;
    }
    if (!window.confirm('이 글을 삭제하시겠습니까?')) return;
    setBusy('delete');
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? '삭제 실패');
      router.push(boardBasePath);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류');
    } finally {
      setBusy(null);
    }
  }

  const content = unlockedHtml?.content ?? post.content;
  const files = unlockedHtml?.files ?? post.files;
  const locked = isPrivateLocked && !unlockedHtml;

  return (
    <article className="post-detail">
      <header className="post-detail__header">
        <h1 className="post-detail__title">
          {post.is_private && <span className="badge badge--lock">비공개</span>}
          {post.is_notice && <span className="badge badge--notice">공지</span>}
          {post.title}
        </h1>
        <dl className="post-detail__meta">
          <div>
            <dt>작성자</dt>
            <dd>{post.is_admin_post ? '관리자' : post.author_name ?? '익명'}</dd>
          </div>
          <div>
            <dt>작성일</dt>
            <dd>{formatDateTime(post.created_at)}</dd>
          </div>
          <div>
            <dt>조회</dt>
            <dd>{post.views.toLocaleString()}</dd>
          </div>
        </dl>
      </header>

      {locked ? (
        <div className="post-detail__locked">
          <p>비공개 글입니다. 작성 시 입력한 비밀번호를 입력해 주세요.</p>
          <form className="form-row form-row--inline" onSubmit={unlockPrivate}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              minLength={4}
              required
              placeholder="비밀번호"
            />
            <button type="submit" className="btn btn--primary" disabled={busy === 'unlock'}>
              {busy === 'unlock' ? '확인 중…' : '확인'}
            </button>
          </form>
          {error && <div className="alert alert--error">{error}</div>}
        </div>
      ) : (
        <div className="post-detail__body">
          {content.split('\n').map((line, idx) => (
            <p key={idx}>{line || '\u00A0'}</p>
          ))}
        </div>
      )}

      {!locked && files.length > 0 && (
        <section className="post-detail__files">
          <h2>첨부파일</h2>
          <ul>
            {files.map((f) => (
              <li key={f.id}>
                <a href={f.url} target="_blank" rel="noopener noreferrer">
                  {f.filename}
                </a>
                {f.size_bytes != null && <span className="muted"> ({formatBytes(f.size_bytes)})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="post-detail__footer">
        <Link href={boardBasePath} className="btn">목록</Link>
        {(isAdmin || (!post.is_admin_post && allowsUserWrite)) && (
          <>
            <button type="button" className="btn btn--danger" onClick={onDelete} disabled={busy === 'delete'}>
              {busy === 'delete' ? '삭제 중…' : '삭제'}
            </button>
            {isAdmin && (
              <Link href={`/admin/posts/${post.id}/edit`} className="btn btn--primary">수정</Link>
            )}
          </>
        )}
      </footer>
    </article>
  );
}
