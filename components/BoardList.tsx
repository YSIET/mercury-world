import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { PostListItem } from '@/lib/types';

interface Props {
  basePath: string;
  notices: PostListItem[];
  items: PostListItem[];
  total: number;
  page: number;
  pageSize: number;
}

function PostRow({ post, basePath, isNotice }: { post: PostListItem; basePath: string; isNotice?: boolean }) {
  return (
    <tr className={isNotice ? 'board-table__row board-table__row--notice' : 'board-table__row'}>
      <td className="board-table__no">
        {isNotice ? <span className="badge badge--notice">공지</span> : post.id}
      </td>
      <td className="board-table__title">
        <Link href={`${basePath}/${post.id}`}>
          {post.is_private && <span className="badge badge--lock" aria-label="비공개">비공개</span>}
          <span>{post.title}</span>
        </Link>
      </td>
      <td className="board-table__author">
        {post.is_admin_post ? '관리자' : post.author_name ?? '익명'}
      </td>
      <td className="board-table__date">{formatDate(post.created_at)}</td>
      <td className="board-table__views">{post.views}</td>
    </tr>
  );
}

export default function BoardList({ basePath, notices, items, total, page, pageSize }: Props) {
  const noPosts = notices.length === 0 && items.length === 0;
  return (
    <div className="board-list">
      <div className="board-list__meta">
        총 <strong>{total.toLocaleString()}</strong>건 · {page} / {Math.max(1, Math.ceil(total / pageSize))} 페이지
      </div>
      <table className="board-table">
        <colgroup>
          <col style={{ width: '70px' }} />
          <col />
          <col style={{ width: '120px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '70px' }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">작성자</th>
            <th scope="col">작성일</th>
            <th scope="col">조회</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((p) => (
            <PostRow key={`notice-${p.id}`} post={p} basePath={basePath} isNotice />
          ))}
          {items.map((p) => (
            <PostRow key={p.id} post={p} basePath={basePath} />
          ))}
          {noPosts && (
            <tr>
              <td className="board-table__empty" colSpan={5}>
                등록된 게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
