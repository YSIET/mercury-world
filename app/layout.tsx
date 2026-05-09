import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_ORIGIN, canonicalFromPathname } from "@/lib/site-canonical";

const SITE = new URL(SITE_ORIGIN);

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
      </head>
      <body>
        {/* 원본 jQuery 1.12.4 그대로 유지 (배너 슬라이더 / 메뉴 hover 동작용) */}
        <Script
          src="https://code.jquery.com/jquery-1.12.4.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/js/banner-slider.js"
          strategy="afterInteractive"
        />
        {/* 원본 페이지 내 보조 스크립트들 (필요 시 해당 페이지에서 추가 로드) */}
        {children}
      </body>
    </html>
  );
}
