"use client";

export default function AdminQnaDeleteBtn({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  async function onClick() {
    if (!window.confirm(`이 글과 모든 하위 답글을 삭제할까요?\n#${id} ${title}`)) return;
    const res = await fetch(`/api/admin/qna/${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("삭제에 실패했습니다.");
      return;
    }
    window.location.href = "/admin/qna";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ fontSize: 12, padding: "4px 10px", cursor: "pointer" }}
    >
      이 글+하위 삭제
    </button>
  );
}
