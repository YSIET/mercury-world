import { getKvPost, isBoardType } from "@/lib/board";
import { notFound } from "next/navigation";
import BoardEditForm from "./BoardEditForm";

export default async function Page({
  params,
}: {
  params: { type: string; id: string };
}) {
  if (!isBoardType(params.type)) notFound();
  const post = await getKvPost(params.type, params.id);
  if (!post) notFound();
  return <BoardEditForm post={post} />;
}
