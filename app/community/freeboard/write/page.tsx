import { Suspense } from "react";
import QnaWriteForm from "./QnaWriteForm";

export default function QnaWritePage() {
  return (
    <Suspense
      fallback={
        <div className="mw-fluid-rail mw-simple-page-rail">
          <div style={{ width: 940, margin: "40px auto", fontSize: 14 }}>
            불러오는 중...
          </div>
        </div>
      }
    >
      <QnaWriteForm />
    </Suspense>
  );
}
