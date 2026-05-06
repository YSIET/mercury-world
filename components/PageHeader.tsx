import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: Props) {
  return (
    <section className="page-header">
      <div className="container">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="breadcrumbs" aria-label="현재 위치">
            <ol>
              <li>
                <Link href="/">홈</Link>
              </li>
              {breadcrumbs.map((b, i) => (
                <li key={`${b.label}-${i}`} aria-current={i === breadcrumbs.length - 1 ? 'page' : undefined}>
                  {b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
