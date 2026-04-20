import { useNavigate } from "react-router-dom";

export default function ResultPage() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("studentInput") || "{}");

  const subjects = data.subjects || [];
  const track = data.track;

  const avg =
    subjects.length > 0
      ? Math.round(
          subjects.reduce((sum: number, s: any) => sum + s.score, 0) /
            subjects.length
        )
      : 0;

  const sorted = [...subjects].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const requiredMap: any = {
    공학: ["수학", "과학"],
    교육: ["국어", "영어"],
    의치한약: ["과학"],
    자연: ["수학", "과학"],
    인문: ["국어", "사회"],
    사회: ["사회", "국어"],
  };

  const required = requiredMap[track] || [];
  const analysisMessages: string[] = [];

  required.forEach((req: string) => {
    const related = subjects.filter((s: any) => s.category === req);

    if (related.length === 0) {
      analysisMessages.push(`⚠️ ${req} 과목이 없습니다. 반드시 준비가 필요합니다.`);
    } else {
      const avgScore =
        related.reduce((sum: number, s: any) => sum + s.score, 0) /
        related.length;

      if (avgScore < 70) {
        analysisMessages.push(`⚠️ ${req} 성적이 낮습니다. 집중 보완이 필요합니다.`);
      } else if (avgScore > 85) {
        analysisMessages.push(`🔥 ${req} 계열이 강점입니다.`);
      }
    }
  });

  const getStrategy = () => {
    if (track === "공학") {
      return "공학 계열은 수학·과학 심화 과목과 프로젝트 경험이 중요합니다.";
    }
    if (track === "교육") {
      return "교육 계열은 국어·영어 성적과 독서 활동이 중요합니다.";
    }
    if (track === "의치한약") {
      return "의·치·한·약 계열은 생명과학, 화학 중심의 깊이 있는 학습이 필요합니다.";
    }
    return "균형 있는 성적과 전공 관련 활동을 함께 준비하세요.";
  };

  return (
    <div className="page">
      <div className="card">
        <h2>성적 분석 결과</h2>

        <h3>📊 평균 점수</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{avg}점</p>

        {best && (
          <>
            <h3>🔥 강점 과목</h3>
            <p>
              {best.category} / {best.subject} ({best.score}점)
            </p>
          </>
        )}

        {worst && (
          <>
            <h3>⚠️ 보완 과목</h3>
            <p>
              {worst.category} / {worst.subject} ({worst.score}점)
            </p>
          </>
        )}

        <h3>🎯 계열 분석</h3>
        {analysisMessages.length > 0 ? (
          <ul>
            {analysisMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p>전체적으로 균형이 잘 잡혀 있습니다.</p>
        )}

        <h3>📌 추천 전략</h3>
        <p>{getStrategy()}</p>

        <div className="top-actions">
          <button onClick={() => navigate("/main")}>
            진로전략 관리로 돌아가기
          </button>
          <button
            className="secondary"
            onClick={() => navigate("/main")}
          >
            성적 다시 입력하기
          </button>
        </div>
      </div>
    </div>
  );
}