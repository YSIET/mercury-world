import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_ORIGIN, canonicalFromPathname } from "@/lib/site-canonical";
import DesktopJqueryScripts from "@/components/DesktopJqueryScripts";

const SITE = new URL(SITE_ORIGIN);

/** Pretendard subset (한글) — globals.css @font-face 와 동일 URL */
const PRETENDARD_SUBSET_WOFF2 = {
  regular:
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2-subset/Pretendard-Regular.subset.woff2",
  bold: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2-subset/Pretendard-Bold.subset.woff2",
} as const;

const rootTitle = "수은세상 - mercury world";
const rootDescription =
  "수은의 위험성과 안전 관리에 대한 종합 정보 - (주)와이에스환경기술연구원이 운영하는 수은 정보 사이트";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const pathname = headers().get("x-pathname") ?? "/";
  const canonical = canonicalFromPathname(pathname);

  return {
    metadataBase: SITE,
    title: {
      default: rootTitle,
      template: "%s | 수은세상",
    },
    description: rootDescription,
    keywords: [
      "수은",
      "mercury",
      "수은 안전",
      "수은 분석",
      "수은 함유량",
      "KOLAS",
      "YS환경기술연구원",
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: rootTitle,
      description: rootDescription,
      siteName: "수은세상",
      locale: "ko_KR",
      type: "website",
      url: canonical,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "수은세상",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: rootTitle,
      description: rootDescription,
      images: ["/og-image.png"],
    },
    verification: {
      other: {
        "naver-site-verification": "49469930b8af79467aea1fa71a1e2258732c31ef",
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <link
          rel="preload"
          href={PRETENDARD_SUBSET_WOFF2.regular}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={PRETENDARD_SUBSET_WOFF2.bold}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <DesktopJqueryScripts />
        {children}
      </body>
    </html>
  );
}
