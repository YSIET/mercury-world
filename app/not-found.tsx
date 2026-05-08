"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header activeGroup={null} activePath="" />
      <table
        width={940}
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ margin: "60px auto", textAlign: "center" }}
      >
        <tbody>
          <tr>
            <td>
              <h1 style={{ fontSize: 24, color: "#0099cc" }}>404</h1>
              <p style={{ color: "#777", margin: "20px 0" }}>
                요청하신 페이지를 찾을 수 없습니다.
              </p>
              <Link href="/" style={{ color: "#308BBC" }}>
                ← 메인으로
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ height: 60 }} />
      <Footer />
    </>
  );
}
