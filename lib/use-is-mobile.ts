"use client";

import { useEffect, useState } from "react";

const MOBILE_MQ = "(max-width: 768px)";

/** SSR-safe: false until mount; 모바일만 페이지네이션 그룹 등 분기용 */
export function useIsMobile768() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isMobile;
}

export const PAGE_GROUP_SIZE_DESKTOP = 10;
export const PAGE_GROUP_SIZE_MOBILE = 5;
