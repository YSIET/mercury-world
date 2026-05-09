"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import {
  iqQuestions,
  calculateScore,
  TOTAL_QUESTIONS,
} from "@/lib/iq";

const wrapperStyle: CSSProperties = {
  width: "min(100%, 780px)",
  margin: "20px auto",
  fontFamily: "굴림, sans-serif",
  fontSize: 14,
  color: "#444",
  lineHeight: 1.6,
  border: "5px solid #CCCCCC",
  padding: 20,
  boxSizing: "border-box",
};

export default function MercuryIqPage() {
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    for (const q of iqQuestions) {
      if (answers[q.id] == null) {
        setError(`${q.num}번 문항의 답변을 선택해 주세요.`);
        const el = document.querySelector<HTMLElement>(
          `input[name="${q.id}"]`
        );
        el?.focus();
        return;
      }
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    const result = calculateScore(answers);
    return (
      <div className="mw-iq-test" style={wrapperStyle}>
        <div style={{ textAlign: "center", padding: "15px 0 18px" }}>
          <img
            src="/img/test/iq_top.gif"
            alt="수은IQ테스트"
            width={504}
            height={94}
          />
        </div>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <ScoreDisplay score={result.total} />
          <div style={{ marginTop: 10 }}>
            <img src="/img/test/jum_img.gif" alt="점" />
          </div>
          <p style={{ fontSize: 16, marginTop: 16 }}>
            {TOTAL_QUESTIONS}문항 중{" "}
            <strong style={{ color: "#FF6600" }}>
              {result.correctCount}문항
            </strong>{" "}
            정답!
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          {result.results.map(({ q, selected, isCorrect }) => (
            <div
              key={q.id}
              style={{
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: "1px dashed #ddd",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <img
                  src={`/img/test/n${q.num}_${isCorrect ? "o" : "x"}.gif`}
                  alt={isCorrect ? "정답" : "오답"}
                  style={{ marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                    {q.num}. {q.question}
                  </div>
                  <div
                    className="mw-iq-review-options"
                    style={{ marginLeft: 16, marginBottom: 10 }}
                  >
                    {q.options.map((opt, i) => {
                      const v = i + 1;
                      const isSel = selected === v;
                      const isCor = q.correct === v;
                      return (
                        <span key={v} style={{ marginRight: 12 }}>
                          <input
                            type="radio"
                            disabled
                            checked={isSel}
                            readOnly
                            onChange={() => {}}
                          />{" "}
                          <span
                            style={{
                              background: isCor ? "#FDD660" : "transparent",
                              padding: isCor ? "0 4px" : "0",
                              color: isSel && !isCor ? "#FF0000" : "#444",
                            }}
                          >
                            {opt}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      marginLeft: 16,
                      padding: 8,
                      border: "1px solid #74CF00",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              fontSize: 14,
              padding: "8px 20px",
              background: "#f0f0f0",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            다시 풀기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mw-iq-test" style={wrapperStyle}>
      <div style={{ textAlign: "center", padding: "15px 0 18px" }}>
        <img
          src="/img/test/iq_top.gif"
          alt="수은IQ테스트"
          width={504}
          height={94}
        />
      </div>
      <form onSubmit={onSubmit}>
        {iqQuestions.map((q) => (
          <div key={q.id} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
              {q.num}. {q.question}
            </div>
            <div className="mw-iq-quiz-options" style={{ marginLeft: 16 }}>
              {q.options.map((opt, i) => {
                const v = i + 1;
                return (
                  <label
                    key={v}
                    className="mw-iq-quiz-option"
                    style={{ marginRight: 16, cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={v}
                      checked={answers[q.id] === v}
                      onChange={() =>
                        setAnswers({ ...answers, [q.id]: v })
                      }
                    />{" "}
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        {error && (
          <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>
            {error}
          </p>
        )}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="submit"
            style={{
              fontSize: 14,
              padding: "8px 20px",
              background: "#f0f0f0",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            결과 보기
          </button>
        </div>
      </form>
    </div>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  const digits = score.toString().split("");
  return (
    <div className="mw-iq-score-display" style={{ display: "inline-flex", alignItems: "center" }}>
      {digits.map((d, i) => (
        <img key={i} src={`/img/test/jum_${d}.gif`} alt={d} />
      ))}
      <img src="/img/test/jum_right.gif" alt="점" />
    </div>
  );
}
