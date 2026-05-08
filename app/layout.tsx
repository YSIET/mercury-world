import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "수은세상",
  description: "수은세상 — 수은 안전 정보 포털",
  // 원본 verification 태그 보존
  other: {
    "naver-site-verification": "49469930b8af79467aea1fa71a1e2258732c31ef",
  },
};

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
