import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoalPage from "./GoalPage";
import GradePage from "./GradePage";
import AIConsultPage from "./AIConsultPage";
import ClubPage from "./ClubPage";
import ReadingPage from "./ReadingPage";
import AwardPage from "./AwardPage";
import ProjectPage from "./ProjectPage";
import { loadGoal } from "../utils/onpaceStorage";

export default function MainPage() {
  const [tab, setTab] = useState("목표");
  const [targetMajor, setTargetMajor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const goal = loadGoal();
    setTargetMajor(goal?.major || "");
  }, [tab]);

  const tabs = ["목표", "성적", "AI상담", "동아리", "독서", "수상", "프로젝트"];

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>ON-Pace 통합 관리</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #2563eb",
            background: "#fff",
            color: "#2563eb",
            fontWeight: 700,
            cursor: "pointer",
            width: "auto",
          }}
        >
          🏠 홈
        </button>
      </div>

      {targetMajor && (
        <div
          style={{
            marginBottom: 16,
            padding: "14px 16px",
            borderRadius: 16,
            background: "#eef4ff",
            border: "1px solid #cfe0ff",
            fontWeight: 700,
          }}
        >
          현재 목표 학과: {targetMajor}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: tab === t ? "2px solid #2563eb" : "1px solid #cbd5e1",
              background: tab === t ? "#2f66e3" : "#fff",
              color: tab === t ? "#fff" : "#0f172a",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "목표" && <GoalPage />}
      {tab === "성적" && <GradePage />}
      {tab === "AI상담" && <AIConsultPage />}
      {tab === "동아리" && <ClubPage />}
      {tab === "독서" && <ReadingPage />}
      {tab === "수상" && <AwardPage />}
      {tab === "프로젝트" && <ProjectPage />}
    </div>
  );
}