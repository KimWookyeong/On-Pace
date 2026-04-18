import { useMemo, useState } from "react";

interface ClubRecord {
  id: number;
  name: string;
  role: string;
  activity: string;
}

const clubGuideMap: Record<
  string,
  {
    recommendedClubs: string[];
    recommendedRoles: string[];
    recommendedActivities: string[];
    keywords: string[];
  }
> = {
  인문: {
    recommendedClubs: ["독서토론", "문예창작", "인문학 탐구"],
    recommendedRoles: ["토론 진행", "자료 정리", "발표"],
    recommendedActivities: [
      "문학 작품 분석 발표",
      "인문 주제 토론 기획",
      "독서 기반 글쓰기 활동",
    ],
    keywords: ["독서", "토론", "글쓰기", "발표", "해석"],
  },
  사회: {
    recommendedClubs: ["경제탐구", "시사토론", "모의의회"],
    recommendedRoles: ["기획", "분석", "발표"],
    recommendedActivities: [
      "경제 뉴스 분석",
      "정책 비교 토론",
      "사회 문제 해결 아이디어 제안",
    ],
    keywords: ["시사", "경제", "정책", "토론", "분석"],
  },
  교육: {
    recommendedClubs: ["멘토링", "교육봉사", "독서토론"],
    recommendedRoles: ["멘토", "기획", "진행"],
    recommendedActivities: [
      "후배 학습 멘토링",
      "수업안 기획",
      "독서 토론 진행",
    ],
    keywords: ["멘토링", "봉사", "소통", "수업", "기획"],
  },
  자연: {
    recommendedClubs: ["과학탐구", "실험탐구", "환경연구"],
    recommendedRoles: ["실험 담당", "자료 조사", "결과 발표"],
    recommendedActivities: [
      "실험 설계 및 수행",
      "탐구 보고서 작성",
      "과학 주제 발표",
    ],
    keywords: ["실험", "탐구", "관찰", "분석", "보고서"],
  },
  공학: {
    recommendedClubs: ["메이커", "코딩", "로봇", "과학탐구"],
    recommendedRoles: ["설계", "제작", "문제 해결", "팀장"],
    recommendedActivities: [
      "기기 설계 및 제작",
      "코딩 프로젝트 진행",
      "공학적 문제 해결 활동",
    ],
    keywords: ["설계", "제작", "코딩", "문제 해결", "프로젝트"],
  },
  의치한약: {
    recommendedClubs: ["생명과학", "보건의료", "실험탐구"],
    recommendedRoles: ["실험 설계", "자료 조사", "발표"],
    recommendedActivities: [
      "생명과학 실험",
      "건강 주제 탐구",
      "의학 관련 독서 발표",
    ],
    keywords: ["생명", "화학", "보건", "실험", "탐구"],
  },
  예체능: {
    recommendedClubs: ["미술", "음악", "체육", "공연예술"],
    recommendedRoles: ["창작", "실연", "기획"],
    recommendedActivities: [
      "작품 제작",
      "공연 준비",
      "체육 프로그램 운영",
    ],
    keywords: ["창작", "표현", "실연", "기획", "참여"],
  },
};

function getMatchLevel(track: string, text: string) {
  const guide = clubGuideMap[track];
  if (!guide) return { score: 0, label: "보통" as const };

  const lower = text.replace(/\s/g, "");
  let score = 0;

  guide.keywords.forEach((keyword) => {
    if (lower.includes(keyword)) score += 1;
  });

  if (score >= 3) return { score, label: "높음" as const };
  if (score >= 1) return { score, label: "보통" as const };
  return { score, label: "낮음" as const };
}

export default function ClubPage() {
  const basicInfo = JSON.parse(localStorage.getItem("basicInfo") || "{}");
  const track = basicInfo.track || "자연";

  const guide = clubGuideMap[track] || clubGuideMap["자연"];

  const [clubName, setClubName] = useState("");
  const [role, setRole] = useState("");
  const [activity, setActivity] = useState("");
  const [savedClubs, setSavedClubs] = useState<ClubRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const analysis = useMemo(() => {
    const combined = `${clubName} ${role} ${activity}`;
    return getMatchLevel(track, combined);
  }, [track, clubName, role, activity]);

  const resetForm = () => {
    setClubName("");
    setRole("");
    setActivity("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!clubName.trim()) {
      alert("동아리 이름을 입력해주세요.");
      return;
    }

    if (!activity.trim()) {
      alert("활동 내용을 입력해주세요.");
      return;
    }

    if (editingId !== null) {
      setSavedClubs((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: clubName.trim(),
                role: role.trim(),
                activity: activity.trim(),
              }
            : item
        )
      );
    } else {
      setSavedClubs((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: clubName.trim(),
          role: role.trim(),
          activity: activity.trim(),
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: ClubRecord) => {
    setClubName(item.name);
    setRole(item.role);
    setActivity(item.activity);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedClubs((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const getFeedback = () => {
    if (!clubName && !role && !activity) {
      return "희망 계열에 맞는 동아리 방향을 먼저 확인해보세요.";
    }

    if (analysis.label === "높음") {
      return "현재 입력한 동아리 활동은 희망 계열과의 연계성이 높습니다. 활동의 과정과 배운 점을 더 구체적으로 정리하면 좋습니다.";
    }

    if (analysis.label === "보통") {
      return "기본적인 연계는 보입니다. 역할의 구체성과 실제 수행 활동을 더 분명하게 적으면 학생부 활용도가 높아집니다.";
    }

    return "현재 입력한 내용만으로는 희망 계열과의 연결성이 약합니다. 추천 역할이나 추천 활동을 참고해 방향을 보완해보세요.";
  };

  const getExpressionTip = () => {
    if (track === "교육") {
      return "예: 후배 학습 지원 활동을 기획하고 진행하며 설명력과 소통 역량을 기름.";
    }
    if (track === "공학") {
      return "예: 문제 해결 과정을 중심으로 설계·제작 활동에 주도적으로 참여함.";
    }
    if (track === "의치한약") {
      return "예: 생명과학 주제 탐구와 자료 분석을 통해 전공 관심과 탐구 역량을 심화함.";
    }
    return "예: 관심 분야와 관련된 활동에 지속적으로 참여하며 탐구 역량을 확장함.";
  };

  const badgeStyle =
    analysis.label === "높음"
      ? { background: "#dcfce7", color: "#166534" }
      : analysis.label === "보통"
      ? { background: "#fef3c7", color: "#92400e" }
      : { background: "#fee2e2", color: "#991b1b" };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>동아리 전략 가이드</h2>
      <p style={{ color: "#6b7280", marginTop: "6px", marginBottom: "18px" }}>
        희망 계열에 맞는 동아리 방향과 역할, 활동 아이디어를 확인해보세요.
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
          현재 희망 계열
        </div>
        <div style={{ fontSize: "28px", fontWeight: 800, marginTop: "4px" }}>
          {track}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>추천 동아리 유형</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.recommendedClubs.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>추천 역할</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.recommendedRoles.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>추천 활동 예시</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.recommendedActivities.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {editingId !== null ? "동아리 활동 수정" : "내 동아리 활동 입력"}
        </h3>

        <label>동아리 이름</label>
        <input
          type="text"
          placeholder="예: 과학탐구동아리"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            margin: "10px 0 14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <label>맡은 역할</label>
        <input
          type="text"
          placeholder="예: 팀장, 발표 담당, 실험 설계"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            margin: "10px 0 14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <label>실제 활동 내용</label>
        <textarea
          placeholder="예: 생명과학 실험을 기획하고 결과를 정리하여 발표함"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "14px",
            margin: "10px 0 0",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "15px",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "inherit",
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
        <h3 style={{ marginTop: 0 }}>AI 동아리 분석</h3>

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

        <p style={{ lineHeight: 1.7 }}>{getFeedback()}</p>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "14px",
            marginTop: "16px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "8px" }}>
            학생부 표현 힌트
          </div>
          <div style={{ color: "#374151", lineHeight: 1.7 }}>
            {getExpressionTip()}
          </div>
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
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>저장된 동아리 활동</h3>

        {savedClubs.length === 0 ? (
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            아직 저장된 동아리 활동이 없습니다.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedClubs.map((item) => (
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

                {item.role && (
                  <div style={{ color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>
                    역할: {item.role}
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
                  {item.activity}
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