import type { Metadata } from "next";
import MobileBackButton from "@/components/MobileBackButton";

export const metadata: Metadata = {
  title: "수은IQ테스트",
};

export default function TestQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mw-test-q-layout-shell">
      <div className="mw-mobile-back-slot">
        <MobileBackButton />
      </div>
      {children}
    </div>
  );
}
