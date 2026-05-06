import Link from 'next/link';

interface Props {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  search?: string;
}

function buildHref(basePath: string, page: number, search?: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (search) params.set('q', search);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({ basePath, page, pageSize, total, search }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const realStart = Math.max(1, end - windowSize + 1);

  const pages: number[] = [];
  for (let p = realStart; p <= end; p++) pages.push(p);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {page > 1 && (
        <Link className="pagination__edge" href={buildHref(basePath, 1, search)}>
          처음
        </Link>
      )}
      {page > 1 && (
        <Link className="pagination__edge" href={buildHref(basePath, page - 1, search)}>
          이전
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p, search)}
          className={p === page ? 'pagination__page pagination__page--active' : 'pagination__page'}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link className="pagination__edge" href={buildHref(basePath, page + 1, search)}>
          다음
        </Link>
      )}
      {page < totalPages && (
        <Link className="pagination__edge" href={buildHref(basePath, totalPages, search)}>
          마지막
        </Link>
      )}
    </nav>
  );
}
