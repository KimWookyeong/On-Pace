import { useState } from "react";

import GoalPage from "./GoalPage";
import GradePage from "./GradePage";
import AIConsultPage from "./AIConsultPage";

import ClubPage from "./ClubPage";
import ReadingPage from "./ReadingPage";
import AwardPage from "./AwardPage";
import ProjectPage from "./ProjectPage";

export default function MainPage() {
  const [tab, setTab] = useState("목표");

  const tabs = [
    "목표",
    "성적",
    "AI상담",
    "동아리",
    "독서",
    "수상",
    "프로젝트",
  ];

  return (
    <div className="page">
      {/* 헤더 */}
      <h2>ON-Pace 통합 관리</h2>

      {/* 탭 메뉴 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: tab === t ? "2px solid #2563eb" : "1px solid #ccc",
              background: tab === t ? "#eff6ff" : "#fff",
              fontWeight: tab === t ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div>
        {tab === "목표" && <GoalPage />}
        {tab === "성적" && <GradePage />}
        {tab === "AI상담" && <AIConsultPage />}
        {tab === "동아리" && <ClubPage />}
        {tab === "독서" && <ReadingPage />}
        {tab === "수상" && <AwardPage />}
        {tab === "프로젝트" && <ProjectPage />}
      </div>
    </div>
  );
}