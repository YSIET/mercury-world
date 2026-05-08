import BoardNewsDetail from "@/components/BoardNewsDetail";
import { boardPostMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return boardPostMetadata("news", params.id);
}

export default function Page({ params }: { params: { id: string } }) {
  return <BoardNewsDetail boardType="news" id={params.id} />;
}
