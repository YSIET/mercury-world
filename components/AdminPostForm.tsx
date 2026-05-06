'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BOARDS, BOARD_SLUGS } from '@/lib/boards';

export interface AdminPostFormInitial {
  id?: number;
  board_slug?: string;
  title?: string;
  content?: string;
  is_notice?: boolean;
  is_private?: boolean;
}

interface Props {
  mode: 'create' | 'edit';
  initial?: AdminPostFormInitial;
}

export default function AdminPostForm({ mode, initial }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const payload = {
        board_slug: String(fd.get('board_slug') ?? ''),
        title: String(fd.get('title') ?? '').trim(),
        content: String(fd.get('content') ?? ''),
        is_notice: fd.get('is_notice') === 'on',
        is_private: fd.get('is_private') === 'on',
      };
      if (!payload.board_slug) throw new Error('게시판을 선택해 주세요.');
      if (!payload.title) throw new Error('제목을 입력해 주세요.');

      const url =
        mode === 'create'
          ? '/api/admin/posts'
          : `/api/admin/posts/${initial?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? '저장 실패');
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      setSubmitting(false);
    }
  }

  return (
    <form className="write-form" onSubmit={onSubmit}>
      <div className="form-row form-row--two">
        <div>
          <label htmlFor="board_slug">게시판</label>
          <select id="board_slug" name="board_slug" defaultValue={initial?.board_slug ?? 'notice'} required>
            {BOARD_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {BOARDS[slug].title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row__flags">
          <label className="checkbox">
            <input type="checkbox" name="is_notice" defaultChecked={initial?.is_notice} />
            <span>공지글로 상단 고정</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" name="is_private" defaultChecked={initial?.is_private} />
            <span>비공개</span>
          </label>
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="title">제목</label>
        <input id="title" name="title" type="text" required maxLength={200} defaultValue={initial?.title ?? ''} />
      </div>
      <div className="form-row">
        <label htmlFor="content">내용</label>
        <textarea id="content" name="content" rows={18} defaultValue={initial?.content ?? ''} />
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  );
}
