"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { MW_JQUERY_READY_EVENT } from "@/lib/jquery-desktop";

/** globals.css · HeaderClient · mw-desktop-home 과 동일 브레이크포인트 */
const DESKTOP_MIN = "(min-width: 769px)";
const JQUERY_SRC = "https://code.jquery.com/jquery-1.12.4.min.js";

/**
 * 데스크탑(≥769px)에서만 jQuery + 배너 슬라이더 로드.
 * 모바일(MobileHome 등)은 React만 사용 — TBT·다운로드 절감.
 */
export default function DesktopJqueryScripts() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [jqueryLoaded, setJqueryLoaded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MIN);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isDesktop) setJqueryLoaded(false);
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <Script
        src={JQUERY_SRC}
        strategy="lazyOnload"
        onLoad={() => {
          setJqueryLoaded(true);
          window.dispatchEvent(new Event(MW_JQUERY_READY_EVENT));
        }}
      />
      {jqueryLoaded ? (
        <Script src="/js/banner-slider.js" strategy="lazyOnload" />
      ) : null}
    </>
  );
}
