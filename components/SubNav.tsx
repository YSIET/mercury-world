'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubNavItem {
  label: string;
  href: string;
}

interface Props {
  title: string;
  items: SubNavItem[];
}

export default function SubNav({ title, items }: Props) {
  const pathname = usePathname();
  return (
    <aside className="sub-nav">
      <h2 className="sub-nav__title">{title}</h2>
      <ul className="sub-nav__list">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={active ? 'sub-nav__link sub-nav__link--active' : 'sub-nav__link'}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
