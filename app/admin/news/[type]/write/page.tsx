import { isBoardType } from "@/lib/board";
import { notFound } from "next/navigation";
import BoardWriteForm from "./BoardWriteForm";

export default function Page({ params }: { params: { type: string } }) {
  if (!isBoardType(params.type)) notFound();
  return <BoardWriteForm boardType={params.type} />;
}
