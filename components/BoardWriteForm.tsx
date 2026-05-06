'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  board: string;
  boardTitle: string;
}

export default function BoardWriteForm({ board, boardTitle }: Props) {
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
        title: String(fd.get('title') ?? '').trim(),
        content: String(fd.get('content') ?? ''),
        author_name: String(fd.get('author_name') ?? '').trim(),
        password: String(fd.get('password') ?? ''),
        is_private: fd.get('is_private') === 'on',
      };
      if (!payload.title) throw new Error('제목을 입력해 주세요.');
      if (!payload.content.trim()) throw new Error('내용을 입력해 주세요.');
      if (!payload.author_name) throw new Error('작성자명을 입력해 주세요.');
      if (payload.password.length < 4) throw new Error('비밀번호는 4자 이상이어야 합니다.');

      const res = await fetch(`/api/bbs/${board}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? '글 등록에 실패했습니다.');
      }
      router.push(`/bbs/${board}/${json.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      setSubmitting(false);
    }
  }

  return (
    <form className="write-form" onSubmit={onSubmit}>
      <h2 className="write-form__heading">{boardTitle} 글쓰기</h2>
      <div className="form-row">
        <label htmlFor="title">제목</label>
        <input id="title" name="title" type="text" required maxLength={200} />
      </div>
      <div className="form-row form-row--two">
        <div>
          <label htmlFor="author_name">작성자</label>
          <input id="author_name" name="author_name" type="text" required maxLength={40} />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input id="password" name="password" type="password" required minLength={4} maxLength={40} />
          <small>수정/삭제 시 사용합니다.</small>
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="content">내용</label>
        <textarea id="content" name="content" rows={14} required />
      </div>
      <div className="form-row form-row--inline">
        <label className="checkbox">
          <input type="checkbox" name="is_private" />
          <span>비공개로 작성 (관리자와 작성자만 열람)</span>
        </label>
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? '등록 중…' : '등록'}
        </button>
      </div>
    </form>
  );
}
