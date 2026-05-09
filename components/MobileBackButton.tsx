"use client";

import { useRouter } from "next/navigation";

export default function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mw-mobile-back-btn"
      aria-label="뒤로가기"
    >
      ← 뒤로
    </button>
  );
}
