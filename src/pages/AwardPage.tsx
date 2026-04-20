import { useEffect, useMemo, useState } from "react";

interface AwardRecord {
  id: number;
  name: string;
  level: string;
  content: string;
}

const awardGuideMap: Record<
  string,
  {
    recommended: string[];
    keywords: string[];
  }
> = {
  공학: { recommended: ["과학탐구대회", "코딩대회", "발명대회"], keywords: ["과학", "코딩", "설계", "제작", "탐구"] },
  교육: { recommended: ["교육 아이디어 대회", "토론대회", "봉사활동 우수상"], keywords: ["교육", "멘토링", "토론", "소통"] },
  의치한약: { recommended: ["생명과학 탐구대회", "의학 관련 탐구대회"], keywords: ["생명", "화학", "의학", "탐구"] },
  자연: { recommended: ["과학탐구대회", "환경탐구대회"], keywords: ["과학", "탐구", "환경"] },
  인문: { recommended: ["글쓰기 대회", "독서토론대회"], keywords: ["글쓰기", "문학", "토론"] },
  사회: { recommended: ["경제 논문 대회", "정책 아이디어 대회"], keywords: ["경제", "사회", "정책"] },
  예체능: { recommended: ["미술대회", "체육대회", "음악 콩쿠르"], keywords: ["예술", "체육", "표현"] },
};

function getMatchLevel(track: string, text: string) {
  const guide = awardGuideMap[track];
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

export default function AwardPage() {
  const basicInfo = JSON.parse(localStorage.getItem("basicInfo") || "{}");
  const track = basicInfo.track || "자연";
  const guide = awardGuideMap[track] || awardGuideMap["자연"];

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [content, setContent] = useState("");
  const [savedAwards, setSavedAwards] = useState<AwardRecord[]>(() => {
    return JSON.parse(localStorage.getItem("awardData") || "[]");
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("awardData", JSON.stringify(savedAwards));
  }, [savedAwards]);

  const analysis = useMemo(() => getMatchLevel(track, `${name} ${content}`), [track, name, content]);

  const resetForm = () => {
    setName("");
    setLevel("");
    setContent("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("대회 이름을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("활동 내용을 입력해주세요.");
      return;
    }

    if (editingId !== null) {
      setSavedAwards((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: name.trim(), level: level.trim(), content: content.trim() }
            : item
        )
      );
    } else {
      setSavedAwards((prev) => [
        ...prev,
        { id: Date.now(), name: name.trim(), level: level.trim(), content: content.trim() },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: AwardRecord) => {
    setName(item.name);
    setLevel(item.level);
    setContent(item.content);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedAwards((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  const getFeedback = () => {
    if (!name && !content) return "추천 대회를 참고해 도전 방향을 먼저 설정해보세요.";
    if (analysis.label === "높음") return "희망 계열과 잘 연결된 수상입니다.";
    if (analysis.label === "보통") return "기본적인 연계성은 있습니다.";
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
      <h2 style={{ marginTop: 0 }}>수상 전략 가이드</h2>
      <p className="muted" style={{ marginTop: "6px", marginBottom: "18px" }}>
        희망 계열에 맞는 대회 방향을 확인하고, 수상 경험을 전략적으로 정리해보세요.
      </p>

      <div className="card section-gap goal-highlight">
        <div className="goal-badge">희망 계열</div>
        <div style={{ fontSize: "28px", fontWeight: 800, marginTop: "10px" }}>{track}</div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>추천 대회</h3>
        <div className="pill-wrap">
          {guide.recommended.map((item) => (
            <div key={item} className="pill" style={{ background: "#eff6ff", color: "#1e3a8a" }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
          {editingId !== null ? "수상 기록 수정" : "수상 입력"}
        </h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>대회 이름</label>
        <input
          type="text"
          placeholder="예: 과학탐구대회"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>수상 등급</label>
        <input
          type="text"
          placeholder="예: 금상, 은상, 장려상"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>활동 내용</label>
        <textarea
          placeholder="무엇을 주제로 준비했고, 어떤 역할을 했는지 적어보세요."
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
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>저장된 수상 기록</h3>

        {savedAwards.length === 0 ? (
          <p className="empty-text">아직 저장된 수상 기록이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedAwards.map((item) => (
              <div key={item.id} className="info-card">
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>{item.name}</div>
                {item.level && (
                  <div style={{ color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>
                    등급: {item.level}
                  </div>
                )}
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