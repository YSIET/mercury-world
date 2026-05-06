import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '수은세상',
    template: '%s | 수은세상',
  },
  description: '수은 정보, 응급처치, 어류 속 수은 섭취 안내 - 수은세상',
  metadataBase: new URL('https://www.mercury.or.kr'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="skip-link">본문 바로가기</a>
        <SiteHeader />
        <main id="main" className="site-main">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
