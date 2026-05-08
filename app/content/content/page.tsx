"use client";

import { useState } from "react";
import SubPageLayout from "@/components/SubPageLayout";
import {
  signalCategories,
  signalFoods,
  calculateSignal,
  type SignalResult,
} from "@/lib/signal";

export default function Page() {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [weight, setWeight] = useState("60");
  const [result, setResult] = useState<SignalResult | null>(null);

  const toggle = (id: number) =>
    setSelected((p) => {
      const n = { ...p };
      if (id in n) delete n[id];
      else n[id] = "0";
      return n;
    });

  const calc = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return alert("체중을 입력해 주세요.");
    const intakes = Object.entries(selected).map(([id, g]) => ({
      food_id: +id,
      grams: parseFloat(g) || 0,
    }));
    if (!intakes.length) return alert("음식을 하나 이상 선택해 주세요.");
    setResult(calculateSignal(intakes, w));
  };

  return (
    <SubPageLayout
      activeGroup={1500}
      sideGroup={1500}
      activePath="/content/content"
      leftCategory="content"
      heroImg="/img/content/img.gif"
      titleImg="/img/content/title_1.gif"
      breadcrumb={<>HOME &gt; 식품속수은 &gt; 수은섭취량테스트</>}
    >
      <div style={{ maxWidth: 700, margin: "20px auto" }}>
        <div
          style={{
            padding: 10,
            background: "#F0F8F8",
            border: "1px solid #5fb3b3",
            marginBottom: 20,
          }}
        >
          <strong>체중 (kg) :</strong>{" "}
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ width: 60, padding: 4 }}
            min={1}
            max={200}
          />
        </div>
        {signalCategories.map((cat) => {
          const foods = signalFoods.filter((f) => f.category_idx === cat.idx);
          if (!foods.length) return null;
          return (
            <div key={cat.idx} style={{ marginBottom: 14 }}>
              <div
                style={{
                  background: "#DCF3F3",
                  padding: "6px 10px",
                  fontWeight: "bold",
                }}
              >
                {cat.name}
              </div>
              <table
                width="100%"
                cellPadding={4}
                style={{ borderCollapse: "collapse" }}
              >
                <tbody>
                  {foods.map((f) => {
                    const checked = f.id in selected;
                    return (
                      <tr key={f.id} style={{ borderBottom: "1px dotted #ddd" }}>
                        <td width="50%">
                          <label style={{ cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggle(f.id)}
                            />{" "}
                            {f.food}
                          </label>
                        </td>
                        <td width="50%">
                          {checked && (
                            <span style={{ fontSize: 11 }}>
                              <input
                                type="number"
                                value={selected[f.id]}
                                onChange={(e) =>
                                  setSelected((s) => ({
                                    ...s,
                                    [f.id]: e.target.value,
                                  }))
                                }
                                style={{
                                  width: 50,
                                  padding: 2,
                                  marginRight: 4,
                                }}
                                min={0}
                              />
                              g{" "}
                              <span style={{ color: "#888" }}>
                                ({f.unit_text})
                              </span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
        <div style={{ textAlign: "center", margin: "24px 0" }}>
          <button
            type="button"
            onClick={calc}
            style={{
              padding: "10px 30px",
              background: "#5fb3b3",
              color: "white",
              border: "none",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            수은 섭취량 측정하기
          </button>
        </div>
      </div>
      {result && (
        <ResultDialog result={result} onClose={() => setResult(null)} />
      )}
    </SubPageLayout>
  );
}

function ResultDialog({
  result,
  onClose,
}: {
  result: SignalResult;
  onClose: () => void;
}) {
  const C = {
    green: { bg: "#4CAF50", img: "/img/content/green.gif" },
    yellow: { bg: "#FFC107", img: "/img/content/yellow.gif" },
    red: { bg: "#F44336", img: "/img/content/red.gif" },
  }[result.level];
  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          border: `10px solid ${C.bg}`,
          padding: 30,
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0" }}>나의 수은 섭취량</h3>
        <img
          src={C.img}
          alt={result.level}
          style={{
            display: "block",
            margin: "16px auto 8px",
            width: 131,
            height: 45,
          }}
        />
        <div
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: C.bg,
            margin: "4px 0 16px",
          }}
        >
          {result.total_ug.toFixed(2)} μg
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6 }}>{result.message}</p>
        <p style={{ fontSize: 11, color: "#999", marginTop: 12 }}>
          체중 {result.weight_kg}kg 기준 권고치: {result.threshold_ug} μg
          <br />
          (이 값은 추정치로 절대값은 아닙니다)
        </p>
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: "8px 24px",
            background: "#5fb3b3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
