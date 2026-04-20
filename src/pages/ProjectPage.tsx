import { useEffect, useMemo, useState } from "react";

interface ProjectRecord {
  id: number;
  title: string;
  content: string;
}

const projectGuideMap: Record<
  string,
  {
    ideas: string[];
    keywords: string[];
  }
> = {
  공학: {
    ideas: ["센서를 활용한 자동화 시스템 제작", "문제 해결형 기계 설계 프로젝트", "코딩 기반 프로그램 개발"],
    keywords: ["설계", "제작", "코딩", "시스템", "문제", "개발"],
  },
  교육: {
    ideas: ["수업 지도안 설계 프로젝트", "학습 멘토링 프로그램 운영", "교육 콘텐츠 제작"],
    keywords: ["수업", "멘토링", "설명", "교육", "지도", "학습"],
  },
  의치한약: {
    ideas: ["생명과학 실험 탐구 프로젝트", "건강 관련 데이터 분석", "의학 관련 독서 기반 탐구"],
    keywords: ["생명", "화학", "실험", "건강", "의학", "탐구"],
  },
  자연: {
    ideas: ["과학 실험 기반 탐구", "환경 변화 분석 프로젝트", "데이터 기반 과학 탐구"],
    keywords: ["실험", "관찰", "데이터", "탐구", "환경", "과학"],
  },
  인문: {
    ideas: ["문학 작품 비교 분석", "철학 주제 탐구", "사회 현상 글쓰기 프로젝트"],
    keywords: ["문학", "분석", "글쓰기", "해석", "철학"],
  },
  사회: {
    ideas: ["경제 데이터 분석 프로젝트", "정책 비교 연구", "사회 문제 해결 아이디어"],
    keywords: ["경제", "정책", "사회", "분석", "문제", "해결"],
  },
  예체능: {
    ideas: ["작품 제작 및 전시 프로젝트", "공연 기획 프로젝트", "체육 프로그램 운영 프로젝트"],
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
  const [savedProjects, setSavedProjects] = useState<ProjectRecord[]>(() => {
    return JSON.parse(localStorage.getItem("projectData") || "[]");
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("projectData", JSON.stringify(savedProjects));
  }, [savedProjects]);

  const analysis = useMemo(() => getMatchLevel(track, `${title} ${content}`), [track, title, content]);

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
          item.id === editingId ? { ...item, title: title.trim(), content: content.trim() } : item
        )
      );
    } else {
      setSavedProjects((prev) => [...prev, { id: Date.now(), title: title.trim(), content: content.trim() }]);
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
    if (editingId === id) resetForm();
  };

  const getFeedback = () => {
    if (!title && !content) return "추천 프로젝트를 참고하여 탐구 방향을 먼저 잡아보세요.";
    if (analysis.label === "높음") return "희망 계열과 매우 잘 연결된 프로젝트입니다.";
    if (analysis.label === "보통") return "기본적인 연계성은 있습니다. 과정과 결과를 더 분명히 적어보세요.";
    return "현재 입력한 내용만으로는 희망 계열과의 연결성이 약합니다.";
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
      <p className="muted" style={{ marginTop: "6px", marginBottom: "18px" }}>
        희망 계열에 맞는 프로젝트 방향을 확인하고, 탐구 활동을 전략적으로 정리해보세요.
      </p>

      <div className="card section-gap goal-highlight">
        <div className="goal-badge">희망 계열</div>
        <div style={{ fontSize: "28px", fontWeight: 800, marginTop: "10px" }}>{track}</div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>추천 프로젝트</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {guide.ideas.map((idea) => (
            <div key={idea} className="info-card" style={{ padding: "12px 14px" }}>
              {idea}
            </div>
          ))}
        </div>
      </div>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
          {editingId !== null ? "프로젝트 수정" : "내 프로젝트 입력"}
        </h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>프로젝트 이름</label>
        <input
          type="text"
          placeholder="예: 환경 변화 데이터 분석 프로젝트"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>프로젝트 내용</label>
        <textarea
          placeholder="무엇을 왜 했는지, 어떤 과정을 거쳤는지, 무엇을 배웠는지 적어보세요."
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
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>저장된 프로젝트</h3>

        {savedProjects.length === 0 ? (
          <p className="empty-text">아직 저장된 프로젝트가 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedProjects.map((item) => (
              <div key={item.id} className="info-card">
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{item.title}</div>
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