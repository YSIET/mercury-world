'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(fd.get('email') ?? ''),
          password: String(fd.get('password') ?? ''),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? '로그인 실패');
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류');
      setSubmitting(false);
    }
  }

  return (
    <form className="write-form admin-login" onSubmit={onSubmit}>
      <div className="form-row">
        <label htmlFor="email">이메일</label>
        <input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="form-row">
        <label htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? '로그인 중…' : '로그인'}
        </button>
      </div>
    </form>
  );
}
