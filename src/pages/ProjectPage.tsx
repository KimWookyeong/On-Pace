import { useMemo, useState } from "react";

interface ProjectRecord {
  id: number;
  title: string;
  content: string;
}

const projectGuideMap: Record<
  string,
  {
    ideas: string[];
    skills: string[];
    keywords: string[];
  }
> = {
  공학: {
    ideas: [
      "센서를 활용한 자동화 시스템 제작",
      "문제 해결형 기계 설계 프로젝트",
      "코딩 기반 프로그램 개발",
    ],
    skills: ["설계", "제작", "문제 해결", "코딩"],
    keywords: ["설계", "제작", "코딩", "시스템", "문제", "개발"],
  },
  교육: {
    ideas: [
      "수업 지도안 설계 프로젝트",
      "학습 멘토링 프로그램 운영",
      "교육 콘텐츠 제작",
    ],
    skills: ["설명", "기획", "소통", "멘토링"],
    keywords: ["수업", "멘토링", "설명", "교육", "지도", "학습"],
  },
  의치한약: {
    ideas: [
      "생명과학 실험 탐구 프로젝트",
      "건강 관련 데이터 분석",
      "의학 관련 독서 기반 탐구",
    ],
    skills: ["탐구", "실험", "분석", "자료 조사"],
    keywords: ["생명", "화학", "실험", "건강", "의학", "탐구"],
  },
  자연: {
    ideas: [
      "과학 실험 기반 탐구",
      "환경 변화 분석 프로젝트",
      "데이터 기반 과학 탐구",
    ],
    skills: ["탐구", "분석", "실험"],
    keywords: ["실험", "관찰", "데이터", "탐구", "환경", "과학"],
  },
  인문: {
    ideas: [
      "문학 작품 비교 분석",
      "철학 주제 탐구",
      "사회 현상 글쓰기 프로젝트",
    ],
    skills: ["분석", "글쓰기", "해석"],
    keywords: ["문학", "분석", "글쓰기", "해석", "철학"],
  },
  사회: {
    ideas: [
      "경제 데이터 분석 프로젝트",
      "정책 비교 연구",
      "사회 문제 해결 아이디어",
    ],
    skills: ["분석", "기획", "비판적 사고"],
    keywords: ["경제", "정책", "사회", "분석", "문제", "해결"],
  },
  예체능: {
    ideas: [
      "작품 제작 및 전시 프로젝트",
      "공연 기획 프로젝트",
      "체육 프로그램 운영 프로젝트",
    ],
    skills: ["창작", "표현", "기획"],
    keywords: ["창작", "표현", "공연", "전시", "기획"],
  },
};

function getMatchLevel(track: string, text: string) {
  const guide = projectGuideMap[track];
  if (!guide) return { label: "보통" as const };

  const joined = text.replace(/\s/g, "");
  let score = 0;

  guide.keywords.forEach((keyword) => {
    if (joined.includes(keyword)) score += 1;
  });

  if (score >= 3) return { label: "높음" as const };
  if (score >= 1) return { label: "보통" as const };
  return { label: "낮음" as const };
}

export default function ProjectPage() {
  const basicInfo = JSON.parse(localStorage.getItem("basicInfo") || "{}");
  const track = basicInfo.track || "자연";
  const guide = projectGuideMap[track] || projectGuideMap["자연"];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [savedProjects, setSavedProjects] = useState<ProjectRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const analysis = useMemo(() => {
    return getMatchLevel(track, `${title} ${content}`);
  }, [track, title, content]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("프로젝트 이름을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("프로젝트 내용을 입력해주세요.");
      return;
    }

    if (editingId !== null) {
      setSavedProjects((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                content: content.trim(),
              }
            : item
        )
      );
    } else {
      setSavedProjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: ProjectRecord) => {
    setTitle(item.title);
    setContent(item.content);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedProjects((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const getFeedback = () => {
    if (!title && !content) {
      return "추천 프로젝트를 참고하여 탐구 방향을 먼저 잡아보세요.";
    }

    if (analysis.label === "높음") {
      return "희망 계열과 매우 잘 연결된 프로젝트입니다. 수행 과정과 문제 해결 과정을 더 구체적으로 정리하면 좋습니다.";
    }

    if (analysis.label === "보통") {
      return "기본적인 연계성은 있습니다. 탐구 과정, 역할, 결과를 더 분명하게 적으면 좋습니다.";
    }

    return "현재 입력한 내용만으로는 희망 계열과의 연결성이 약합니다. 추천 프로젝트 방향을 참고해 수정해보세요.";
  };

  const getTip = () => {
    if (track === "공학") {
      return "문제 정의 → 설계 → 제작 → 개선 과정이 드러나도록 작성하세요.";
    }
    if (track === "교육") {
      return "누구를 위해 무엇을 기획했고, 어떻게 설명하고 운영했는지가 드러나도록 쓰세요.";
    }
    if (track === "의치한약") {
      return "탐구 동기, 실험 과정, 자료 분석, 결론이 보이도록 정리하세요.";
    }
    return "주제 선정 이유, 진행 과정, 결과, 배운 점이 드러나도록 쓰세요.";
  };

  const badgeStyle =
    analysis.label === "높음"
      ? { background: "#dcfce7", color: "#166534" }
      : analysis.label === "보통"
      ? { background: "#fef3c7", color: "#92400e" }
      : { background: "#fee2e2", color: "#991b1b" };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>프로젝트 전략 가이드</h2>
      <p style={{ color: "#6b7280", marginTop: "6px", marginBottom: "18px" }}>
        희망 계열에 맞는 프로젝트 방향을 확인하고, 나의 탐구 활동을 전략적으로 정리해보세요.
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
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>추천 프로젝트</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {guide.ideas.map((idea) => (
            <div
              key={idea}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "12px 14px",
                lineHeight: 1.6,
              }}
            >
              {idea}
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
          {editingId !== null ? "프로젝트 수정" : "내 프로젝트 입력"}
        </h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          프로젝트 이름
        </label>
        <input
          type="text"
          placeholder="예: 환경 변화 데이터 분석 프로젝트"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          프로젝트 내용
        </label>
        <textarea
          placeholder="무엇을 왜 했는지, 어떤 과정을 거쳤는지, 무엇을 배웠는지 적어보세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            minHeight: "150px",
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
          <button
            onClick={handleSave}
            style={{ flex: 1, marginTop: 0 }}
          >
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
          <div style={{ fontWeight: 700, marginBottom: "8px" }}>작성 팁</div>
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
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>저장된 프로젝트</h3>

        {savedProjects.length === 0 ? (
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            아직 저장된 프로젝트가 없습니다.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedProjects.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "14px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
                  {item.title}
                </div>
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
                    style={{
                      flex: 1,
                      marginTop: 0,
                      background: "#2563eb",
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      flex: 1,
                      marginTop: 0,
                      background: "#ef4444",
                    }}
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