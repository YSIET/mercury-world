import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "수은IQ테스트",
};

export default function TestQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
