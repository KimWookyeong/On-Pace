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
    keywords: ["과학", "코딩", "설계", "제작", "탐구"],
  },
  교육: {
    recommended: ["교육 아이디어 대회", "토론대회", "봉사활동 우수상"],
    keywords: ["교육", "멘토링", "토론", "소통"],
  },
  의치한약: {
    recommended: ["생명과학 탐구대회", "의학 관련 탐구"],
    keywords: ["생명", "화학", "의학", "탐구"],
  },
  자연: {
    recommended: ["과학탐구대회", "환경탐구대회"],
    keywords: ["과학", "탐구", "환경"],
  },
  인문: {
    recommended: ["글쓰기 대회", "독서토론대회"],
    keywords: ["글쓰기", "문학", "토론"],
  },
  사회: {
    recommended: ["경제 논문 대회", "정책 아이디어 대회"],
    keywords: ["경제", "사회", "정책"],
  },
  예체능: {
    recommended: ["미술대회", "체육대회", "음악 콩쿠르"],
    keywords: ["예술", "체육", "표현"],
  },
};

function getMatchLevel(track: string, text: string) {
  const guide = awardGuideMap[track];
  if (!guide) return { label: "보통" };

  let score = 0;
  guide.keywords.forEach((k) => {
    if (text.includes(k)) score++;
  });

  if (score >= 2) return { label: "높음" };
  if (score >= 1) return { label: "보통" };
  return { label: "낮음" };
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
    return getMatchLevel(track, name + content);
  }, [track, name, content]);

  const reset = () => {
    setName("");
    setLevel("");
    setContent("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!name) return alert("대회 이름 입력");

    if (editingId !== null) {
      setSavedAwards((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, name, level, content } : a
        )
      );
    } else {
      setSavedAwards((prev) => [
        ...prev,
        { id: Date.now(), name, level, content },
      ]);
    }

    reset();
  };

  const handleEdit = (item: AwardRecord) => {
    setName(item.name);
    setLevel(item.level);
    setContent(item.content);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedAwards((prev) => prev.filter((a) => a.id !== id));
  };

  const getFeedback = () => {
    if (!name) return "추천 대회를 참고해 도전 방향을 설정하세요.";
    if (analysis.label === "높음") return "전공 연계성이 높은 수상입니다.";
    if (analysis.label === "보통") return "기본 연계는 있으나 더 강화 필요.";
    return "전공과의 연계성이 낮습니다.";
  };

  return (
    <div>
      <h2>수상 전략 가이드</h2>

      <div style={{ background: "#eff6ff", padding: "16px", borderRadius: "16px" }}>
        <div>희망 계열</div>
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{track}</div>
      </div>

      <h3>추천 대회</h3>
      <ul>
        {guide.recommended.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <hr />

      <h3>{editingId ? "수상 수정" : "수상 입력"}</h3>

      <input
        placeholder="대회 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="수상 등급 (금상, 은상 등)"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      />

      <textarea
        placeholder="활동 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSave}>
        {editingId ? "수정 완료" : "저장"}
      </button>

      <h3>AI 분석</h3>
      <p>연계도: {analysis.label}</p>
      <p>{getFeedback()}</p>

      <h3>저장된 수상</h3>
      {savedAwards.map((a) => (
        <div key={a.id}>
          <b>{a.name}</b> ({a.level})
          <p>{a.content}</p>
          <button onClick={() => handleEdit(a)}>수정</button>
          <button onClick={() => handleDelete(a.id)}>삭제</button>
        </div>
      ))}
    </div>
  );
}