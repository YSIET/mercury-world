import PageHeader, { type BreadcrumbItem } from './PageHeader';
import SubNav from './SubNav';

interface SubNavItem {
  label: string;
  href: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  subNavTitle: string;
  subNavItems: SubNavItem[];
  children: React.ReactNode;
}

export default function InfoPageLayout({
  title,
  subtitle,
  breadcrumbs,
  subNavTitle,
  subNavItems,
  children,
}: Props) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <div className="container">
        <div className="page-grid">
          <SubNav title={subNavTitle} items={subNavItems} />
          <article className="page-content">{children}</article>
        </div>
      </div>
    </>
  );
}

export const SECTION_NAVS = {
  site: {
    title: '수은세상 소개',
    items: [{ label: '인사말', href: '/site/greeting' }],
  },
  mercury: {
    title: '수은이란',
    items: [
      { label: '수은이란?', href: '/mercury/mercury' },
      { label: '수은의 순환', href: '/mercury/cycle' },
      { label: '어류 속 수은', href: '/mercury/fish' },
      { label: '응급처치', href: '/mercury/emergency' },
      { label: '수은 기준', href: '/mercury/standard' },
    ],
  },
  content: {
    title: '콘텐츠',
    items: [
      { label: '수은 콘텐츠', href: '/content/content' },
      { label: '하루 섭취량', href: '/content/oneday' },
    ],
  },
} as const;
