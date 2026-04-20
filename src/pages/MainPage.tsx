import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoalPage from "./GoalPage";
import InputPage from "./InputPage";
import ClubPage from "./ClubPage";
import ReadingPage from "./ReadingPage";
import AwardPage from "./AwardPage";
import ProjectPage from "./ProjectPage";

function calculateMatchData(goalInfo: any) {
  const studentInput = JSON.parse(localStorage.getItem("studentInput") || "{}");
  const clubData = JSON.parse(localStorage.getItem("clubData") || "[]");
  const readingData = JSON.parse(localStorage.getItem("readingData") || "[]");
  const awardData = JSON.parse(localStorage.getItem("awardData") || "[]");
  const projectData = JSON.parse(localStorage.getItem("projectData") || "[]");

  const 부족한요소: string[] = [];
  const 추천행동: string[] = [];

  const hasGoal = !!(goalInfo.finalUniversity && goalInfo.finalDepartment);

  // 목표가 없으면 매칭률은 무조건 0으로 초기화
  if (!hasGoal) {
    부족한요소.push("목표 대학/학과 설정");
    추천행동.push("먼저 목표 대학과 학과를 설정하세요.");

    return {
      score: 0,
      부족한요소,
      추천행동,
    };
  }

  let score = 0;

  score += 15; // 목표 설정

  if (studentInput.subjects && studentInput.subjects.length > 0) {
    score += 20;
  } else {
    부족한요소.push("성적 입력");
    추천행동.push("과목별 성적을 입력해 현재 학업 상태를 확인하세요.");
  }

  if (clubData.length > 0) {
    score += 15;
  } else {
    부족한요소.push("동아리 활동");
    추천행동.push("희망 학과와 관련된 동아리 활동을 1개 이상 정리하세요.");
  }

  if (readingData.length > 0) {
    score += 15;
  } else {
    부족한요소.push("독서 활동");
    추천행동.push("전공 관련 도서를 읽고 기록을 남겨보세요.");
  }

  if (awardData.length > 0) {
    score += 15;
  } else {
    부족한요소.push("수상 기록");
    추천행동.push("관심 분야와 연결되는 대회나 탐구 활동을 찾아보세요.");
  }

  if (projectData.length > 0) {
    score += 20;
  } else {
    부족한요소.push("프로젝트 활동");
    추천행동.push("희망 학과와 연결되는 프로젝트를 1개 기획해보세요.");
  }

  return {
    score,
    부족한요소,
    추천행동: 추천행동.slice(0, 3),
  };
}

export default function MainPage() {
  const [tab, setTab] = useState("목표");
  const navigate = useNavigate();

  const [goalInfo, setGoalInfo] = useState(() =>
    JSON.parse(localStorage.getItem("goalInfo") || "{}")
  );

  const tabs = ["목표", "성적", "동아리", "독서", "수상", "프로젝트"];

  useEffect(() => {
    const syncGoalInfo = () => {
      setGoalInfo(JSON.parse(localStorage.getItem("goalInfo") || "{}"));
    };

    // 같은 탭 내 커스텀 이벤트 반영
    window.addEventListener("goalInfoUpdated", syncGoalInfo);

    // 다른 탭/창에서 localStorage 바뀔 때 반영
    window.addEventListener("storage", syncGoalInfo);

    return () => {
      window.removeEventListener("goalInfoUpdated", syncGoalInfo);
      window.removeEventListener("storage", syncGoalInfo);
    };
  }, []);

  const { score, 부족한요소, 추천행동 } = useMemo(() => {
    return calculateMatchData(goalInfo);
  }, [goalInfo]);

  return (
    <div className="page">
      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <h1>진로 전략 관리</h1>

          <button
            onClick={() => navigate("/")}
            style={{
              width: "auto",
              padding: "8px 12px",
              background: "#e5e7eb",
              color: "#111",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            홈
          </button>
        </div>

        <p className="muted" style={{ marginTop: "6px" }}>
          목표 학과 기준으로 나의 준비 상태를 분석하세요.
        </p>
      </div>

      <div
        className="card"
        style={{
          marginBottom: "18px",
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          border: "1px solid #bfdbfe",
        }}
      >
        <div style={{ fontSize: "13px", color: "#1d4ed8", fontWeight: 700 }}>
          🎯 현재 목표
        </div>

        <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "6px" }}>
          {goalInfo.finalUniversity || "대학 미설정"}
        </div>

        <div style={{ fontSize: "16px", fontWeight: 600 }}>
          {goalInfo.finalDepartment || "학과 미설정"}
        </div>

        {!goalInfo.finalUniversity && (
          <p style={{ marginTop: "10px", fontSize: "13px", color: "#6b7280" }}>
            먼저 목표를 설정하면 맞춤 전략을 받을 수 있어요.
          </p>
        )}
      </div>

      <div className="card section-gap" style={{ marginBottom: "18px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>목표 학과 매칭률</h3>

        <div
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "#2563eb",
            marginBottom: "12px",
          }}
        >
          {score}%
        </div>

        <div
          style={{
            width: "100%",
            height: "14px",
            background: "#e5e7eb",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: `${score}%`,
              height: "100%",
              background: "linear-gradient(90deg, #2563eb, #4f46e5)",
              borderRadius: "999px",
              transition: "width 0.25s ease",
            }}
          />
        </div>

        <p className="muted" style={{ marginBottom: 0 }}>
          현재 입력된 데이터를 바탕으로 간단하게 계산한 준비도입니다.
        </p>
      </div>

      <div className="card-grid-2 section-gap" style={{ marginBottom: "18px" }}>
        <div className="info-card">
          <h3 style={{ marginTop: 0 }}>부족한 요소</h3>
          {부족한요소.length > 0 ? (
            <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
              {부족한요소.map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">현재 입력 기준으로 기본 준비가 잘 되어 있어요.</p>
          )}
        </div>

        <div className="info-card">
          <h3 style={{ marginTop: 0 }}>지금 해야 할 행동</h3>
          {추천행동.length > 0 ? (
            <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
              {추천행동.map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">다음 단계 준비가 잘 되어 있습니다.</p>
          )}
        </div>
      </div>

      <div className="tab-grid">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-button ${tab === t ? "active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === "목표" && <GoalPage />}
        {tab === "성적" && <InputPage />}
        {tab === "동아리" && <ClubPage />}
        {tab === "독서" && <ReadingPage />}
        {tab === "수상" && <AwardPage />}
        {tab === "프로젝트" && <ProjectPage />}
      </div>
    </div>
  );
}