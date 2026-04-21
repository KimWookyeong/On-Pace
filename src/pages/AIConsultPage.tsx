import React, { useEffect, useMemo, useState } from "react";

type Strategy = "교과" | "종합" | "논술" | "정시" | "실기";

export default function AIConsultPage() {
  const [gradeData, setGradeData] = useState<any[]>([]);
  const [goalData, setGoalData] = useState<any>(null);

  useEffect(() => {
    const grades = JSON.parse(localStorage.getItem("gradeData") || "[]");
    const goal = JSON.parse(localStorage.getItem("goalData") || "null");

    setGradeData(grades);
    setGoalData(goal);
  }, []);

  // 평균 계산
  const avg = (arr: number[]) =>
    arr.length === 0
      ? 0
      : Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  const gpa = useMemo(() => {
    if (gradeData.length === 0) return 0;
    return avg(
      gradeData.map((r) =>
        avg([r.korean, r.math, r.english, r.science, r.social])
      )
    );
  }, [gradeData]);

  // 간단 매칭 로직
  const rates = useMemo(() => {
    if (!goalData) return null;

    const toScore = (grade: number) => 100 - grade * 10;

    return {
      교과: toScore(gpa) * 0.8 + (goalData.activitiesScore || 50) * 0.2,
      종합:
        (goalData.activitiesScore || 50) * 0.4 +
        (goalData.majorFitScore || 50) * 0.4 +
        toScore(gpa) * 0.2,
      논술:
        (goalData.essayScore || 50) * 0.6 + toScore(gpa) * 0.4,
      정시: 100 - (goalData.mockExam || 5) * 10,
      실기:
        (goalData.practicalScore || 50) * 0.7 +
        (goalData.activitiesScore || 50) * 0.3,
    };
  }, [goalData, gpa]);

  const sorted = useMemo(() => {
    if (!rates) return [];
    return Object.entries(rates).sort((a, b) => b[1] - a[1]);
  }, [rates]);

  const top = sorted[0];

  const getAdvice = (type: Strategy) => {
    switch (type) {
      case "종합":
        return [
          "전공 관련 프로젝트 수행",
          "심화 탐구 활동 강화",
          "독서 + 보고서 작성",
        ];
      case "교과":
        return ["내신 관리 집중", "시험 대비 루틴 구축"];
      case "정시":
        return ["수능 문제풀이 반복", "모의고사 분석"];
      case "논술":
        return ["논술 기출 분석", "독해 훈련"];
      case "실기":
        return ["포트폴리오 제작", "실기 연습"];
      default:
        return [];
    }
  };

  if (!goalData) {
    return <div>⚠️ 목표 설정 먼저 해주세요</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 AI 상담</h2>

      <h3>추천 전형</h3>

      {sorted.map(([type, score], i) => (
        <div key={type}>
          {i + 1}순위: {type} ({Math.round(score)}%)
        </div>
      ))}

      {top && (
        <>
          <h3>📌 추천 전략</h3>
          <ul>
            {getAdvice(top[0] as Strategy).map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}