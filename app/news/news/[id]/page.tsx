import BoardNewsDetail from "@/components/BoardNewsDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <BoardNewsDetail boardType="news" id={params.id} />;
}
