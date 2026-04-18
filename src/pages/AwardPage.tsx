import { useMemo, useState } from "react";

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
  공학: {
    recommended: ["과학탐구대회", "코딩대회", "발명대회"],
    keywords: ["과학", "코딩", "설계", "제작", "탐구", "발명"],
  },
  교육: {
    recommended: ["교육 아이디어 대회", "토론대회", "봉사활동 우수상"],
    keywords: ["교육", "멘토링", "토론", "소통", "봉사"],
  },
  의치한약: {
    recommended: ["생명과학 탐구대회", "의학 관련 탐구대회"],
    keywords: ["생명", "화학", "의학", "탐구", "건강"],
  },
  자연: {
    recommended: ["과학탐구대회", "환경탐구대회"],
    keywords: ["과학", "탐구", "환경", "실험"],
  },
  인문: {
    recommended: ["글쓰기 대회", "독서토론대회"],
    keywords: ["글쓰기", "문학", "토론", "인문"],
  },
  사회: {
    recommended: ["경제 논문 대회", "정책 아이디어 대회"],
    keywords: ["경제", "사회", "정책", "분석"],
  },
  예체능: {
    recommended: ["미술대회", "체육대회", "음악 콩쿠르"],
    keywords: ["예술", "체육", "표현", "창작"],
  },
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
  const [savedAwards, setSavedAwards] = useState<AwardRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const analysis = useMemo(() => {
    return getMatchLevel(track, `${name} ${content}`);
  }, [track, name, content]);

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
            ? {
                ...item,
                name: name.trim(),
                level: level.trim(),
                content: content.trim(),
              }
            : item
        )
      );
    } else {
      setSavedAwards((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: name.trim(),
          level: level.trim(),
          content: content.trim(),
        },
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
    if (!name && !content) {
      return "추천 대회를 참고해 도전 방향을 먼저 설정해보세요.";
    }

    if (analysis.label === "높음") {
      return "희망 계열과 잘 연결된 수상입니다. 준비 과정과 본인의 역할을 더 구체적으로 정리하면 좋습니다.";
    }

    if (analysis.label === "보통") {
      return "기본적인 연계성은 있습니다. 활동 과정과 배운 점을 조금 더 분명하게 드러내면 좋습니다.";
    }

    return "현재 입력 내용만으로는 희망 계열과의 연결성이 약합니다. 추천 대회를 참고해 방향을 보완해보세요.";
  };

  const getTip = () => {
    return "대회명 → 준비 과정 → 본인의 역할 → 결과 → 배운 점 순서로 정리하면 학생부 활용도가 높아집니다.";
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
      <p style={{ color: "#6b7280", marginTop: "6px", marginBottom: "18px" }}>
        희망 계열에 맞는 대회 방향을 확인하고, 수상 경험을 전략적으로 정리해보세요.
      </p>

      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "18px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#1d4ed8", fontWeight: 700 }}>
          희망 계열
        </div>
        <div style={{ fontSize: "28px", fontWeight: 800, marginTop: "4px" }}>
          {track}
        </div>
      </div>

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "18px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>추천 대회</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {guide.recommended.map((item) => (
            <div
              key={item}
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                background: "#ffffff",
                border: "1px solid #dbeafe",
                color: "#1e3a8a",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "18px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
          {editingId !== null ? "수상 기록 수정" : "수상 입력"}
        </h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          대회 이름
        </label>
        <input
          type="text"
          placeholder="예: 과학탐구대회"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          수상 등급
        </label>
        <input
          type="text"
          placeholder="예: 금상, 은상, 장려상"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          활동 내용
        </label>
        <textarea
          placeholder="무엇을 주제로 준비했고, 어떤 역할을 했는지, 무엇을 배웠는지 적어보세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            minHeight: "140px",
            padding: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "15px",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "inherit",
            lineHeight: 1.6,
          }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <button onClick={handleSave} style={{ flex: 1, marginTop: 0 }}>
            {editingId !== null ? "수정 완료" : "저장"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                flex: 1,
                marginTop: 0,
                background: "#6b7280",
              }}
            >
              수정 취소
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "18px",
        }}
      >
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

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "14px",
            marginTop: "14px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "8px" }}>학생부 표현 팁</div>
          <div style={{ color: "#374151", lineHeight: 1.7 }}>{getTip()}</div>
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "18px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>저장된 수상 기록</h3>

        {savedAwards.length === 0 ? (
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            아직 저장된 수상 기록이 없습니다.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedAwards.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "14px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>
                  {item.name}
                </div>

                {item.level && (
                  <div style={{ color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>
                    등급: {item.level}
                  </div>
                )}

                <div
                  style={{
                    color: "#374151",
                    lineHeight: 1.6,
                    marginBottom: "12px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.content}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    style={{ flex: 1, marginTop: 0, background: "#2563eb" }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{ flex: 1, marginTop: 0, background: "#ef4444" }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}