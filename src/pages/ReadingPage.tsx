import { useEffect, useMemo, useState } from "react";

interface ReadingRecord {
  id: number;
  book: string;
  content: string;
}

const readingGuideMap: Record<
  string,
  {
    books: string[];
    keywords: string[];
  }
> = {
  공학: { books: ["코스모스", "클린 코드"], keywords: ["수학", "과학", "기술", "코딩", "문제"] },
  교육: { books: ["교육학 개론", "페다고지"], keywords: ["교육", "성장", "지도", "학습", "소통"] },
  의치한약: { books: ["이기적 유전자", "생명이란 무엇인가"], keywords: ["생명", "의학", "건강", "유전자"] },
  자연: { books: ["과학 콘서트", "침묵의 봄"], keywords: ["과학", "탐구", "자연", "실험"] },
  인문: { books: ["총, 균, 쇠", "사피엔스"], keywords: ["역사", "문화", "인문"] },
  사회: { books: ["정의란 무엇인가", "공정하다는 착각"], keywords: ["사회", "정의", "정치"] },
  예체능: { books: ["예술의 쓸모", "체육의 역사"], keywords: ["예술", "창작", "표현"] },
};

function getMatchLevel(track: string, text: string) {
  const guide = readingGuideMap[track];
  if (!guide) return { label: "보통" as const };

  const joined = text.replace(/\s/g, "");
  let score = 0;
  guide.keywords.forEach((keyword) => {
    if (joined.includes(keyword)) score += 1;
  });

  if (score >= 2) return { label: "높음" as const };
  if (score >= 1) return { label: "보통" as const };
  return { label: "낮음" as const };
}

export default function ReadingPage() {
  const basicInfo = JSON.parse(localStorage.getItem("basicInfo") || "{}");
  const track = basicInfo.track || "자연";
  const guide = readingGuideMap[track] || readingGuideMap["자연"];

  const [book, setBook] = useState("");
  const [content, setContent] = useState("");
  const [savedReadings, setSavedReadings] = useState<ReadingRecord[]>(() => {
    return JSON.parse(localStorage.getItem("readingData") || "[]");
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("readingData", JSON.stringify(savedReadings));
  }, [savedReadings]);

  const analysis = useMemo(() => getMatchLevel(track, `${book} ${content}`), [track, book, content]);

  const resetForm = () => {
    setBook("");
    setContent("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!book.trim()) {
      alert("책 제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용 요약 및 느낀 점을 입력해주세요.");
      return;
    }

    if (editingId !== null) {
      setSavedReadings((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, book: book.trim(), content: content.trim() } : item
        )
      );
    } else {
      setSavedReadings((prev) => [...prev, { id: Date.now(), book: book.trim(), content: content.trim() }]);
    }

    resetForm();
  };

  const handleEdit = (item: ReadingRecord) => {
    setBook(item.book);
    setContent(item.content);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedReadings((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  const getFeedback = () => {
    if (!book && !content) return "추천 도서를 참고해 읽을 책을 고르고, 진로와 연결해보세요.";
    if (analysis.label === "높음") return "희망 계열과 잘 연결된 독서입니다.";
    if (analysis.label === "보통") return "기본적인 연계성은 있습니다. 연결점을 더 구체적으로 적어보세요.";
    return "현재 입력 내용만으로는 희망 계열과의 연결성이 약합니다.";
  };

  const badgeStyle =
    analysis.label === "높음"
      ? { background: "#dcfce7", color: "#166534" }
      : analysis.label === "보통"
      ? { background: "#fef3c7", color: "#92400e" }
      : { background: "#fee2e2", color: "#991b1b" };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>독서 전략 가이드</h2>
      <p className="muted" style={{ marginTop: "6px", marginBottom: "18px" }}>
        희망 계열에 맞는 독서 방향을 확인하고, 읽은 책을 진로와 연결해보세요.
      </p>

      <div className="card section-gap goal-highlight">
        <div className="goal-badge">희망 계열</div>
        <div style={{ fontSize: "28px", fontWeight: 800, marginTop: "10px" }}>{track}</div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>추천 도서</h3>
        <div className="pill-wrap">
          {guide.books.map((b) => (
            <div key={b} className="pill" style={{ background: "#eff6ff", color: "#1e3a8a" }}>
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
          {editingId !== null ? "독서 기록 수정" : "내 독서 입력"}
        </h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>책 제목</label>
        <input
          type="text"
          placeholder="예: 과학 콘서트"
          value={book}
          onChange={(e) => setBook(e.target.value)}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>내용 요약 및 느낀 점</label>
        <textarea
          placeholder="책의 핵심 내용, 인상 깊은 부분, 진로와 연결되는 생각을 적어보세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="top-actions">
          <button onClick={handleSave}>{editingId !== null ? "수정 완료" : "저장"}</button>
          {editingId !== null && (
            <button type="button" className="ghost" onClick={resetForm}>
              수정 취소
            </button>
          )}
        </div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>AI 분석</h3>
        <div
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: "999px",
            fontWeight: 700,
            marginBottom: "14px",
            ...badgeStyle,
          }}
        >
          연계도 {analysis.label}
        </div>
        <p style={{ lineHeight: 1.7, marginTop: 0 }}>{getFeedback()}</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>저장된 독서 기록</h3>

        {savedReadings.length === 0 ? (
          <p className="empty-text">아직 저장된 독서 기록이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedReadings.map((item) => (
              <div key={item.id} className="info-card">
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{item.book}</div>
                <div style={{ color: "#374151", lineHeight: 1.6, marginBottom: "12px", whiteSpace: "pre-wrap" }}>
                  {item.content}
                </div>

                <div className="top-actions">
                  <button type="button" onClick={() => handleEdit(item)}>수정</button>
                  <button type="button" className="danger" onClick={() => handleDelete(item.id)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}