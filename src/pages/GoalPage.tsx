import { useMemo, useState } from "react";

interface GoalGuide {
  subjects: string[];
  activities: string[];
  books: string[];
  projects: string[];
}

const universityOptions = [
  "서울대학교",
  "고려대학교",
  "연세대학교",
  "부산대학교",
  "경북대학교",
  "부경대학교",
  "한국교원대학교",
  "기타",
];

const departmentGuideMap: Record<string, GoalGuide> = {
  기계공학과: {
    subjects: ["수학", "물리학", "미적분", "기하"],
    activities: ["메이커 활동", "과학탐구 동아리", "설계 활동"],
    books: ["공학이란 무엇인가", "문제 해결 관련 도서"],
    projects: ["기계 설계 프로젝트", "자동화 시스템 제작"],
  },
  컴퓨터공학과: {
    subjects: ["수학", "정보", "확률과 통계", "미적분"],
    activities: ["코딩 동아리", "알고리즘 탐구", "앱 개발 활동"],
    books: ["클린 코드", "컴퓨팅 사고 관련 도서"],
    projects: ["앱 개발", "웹 개발", "코딩 프로젝트"],
  },
  국어교육과: {
    subjects: ["국어", "영어", "문학", "화법과 언어"],
    activities: ["독서토론", "멘토링", "발표 활동"],
    books: ["교육학 개론", "문학 작품", "교사 관련 에세이"],
    projects: ["수업안 설계", "독서 교육 프로젝트"],
  },
  영어교육과: {
    subjects: ["영어", "국어", "영어Ⅰ", "영어Ⅱ"],
    activities: ["영어 토론", "멘토링", "발표 활동"],
    books: ["영어교육 관련 도서", "언어학 입문"],
    projects: ["영어 수업 자료 제작", "영어 말하기 프로젝트"],
  },
  초등교육과: {
    subjects: ["국어", "영어", "사회", "교육 관련 과목"],
    activities: ["멘토링", "봉사", "독서토론"],
    books: ["교육학 개론", "아동 발달 도서"],
    projects: ["수업 설계 프로젝트", "아동 대상 교육 활동"],
  },
  의예과: {
    subjects: ["생명과학", "화학", "수학", "과학탐구"],
    activities: ["생명과학 탐구", "실험 활동", "보건 관련 활동"],
    books: ["이기적 유전자", "생명이란 무엇인가"],
    projects: ["생명과학 실험", "건강 데이터 분석"],
  },
  간호학과: {
    subjects: ["생명과학", "화학", "영어"],
    activities: ["보건 봉사", "생명과학 탐구", "의료 관련 활동"],
    books: ["간호학 입문", "의료 윤리 관련 도서"],
    projects: ["건강 교육 프로젝트", "보건 캠페인"],
  },
  경영학과: {
    subjects: ["사회", "경제", "수학", "확률과 통계"],
    activities: ["경제 탐구", "토론", "학생회 활동"],
    books: ["경영학 원론", "경제 관련 도서"],
    projects: ["시장 조사 프로젝트", "창업 아이디어 프로젝트"],
  },
  경제학과: {
    subjects: ["경제", "수학", "사회", "확률과 통계"],
    activities: ["시사 토론", "경제 뉴스 분석", "데이터 탐구"],
    books: ["경제학 입문", "정의란 무엇인가"],
    projects: ["경제 데이터 분석", "정책 비교 연구"],
  },
  심리학과: {
    subjects: ["사회", "생명과학", "국어"],
    activities: ["상담 활동", "토론", "관찰 기록 활동"],
    books: ["심리학 개론", "인간 행동 관련 도서"],
    projects: ["심리 실험", "행동 관찰 프로젝트"],
  },
  생명과학과: {
    subjects: ["생명과학", "화학", "수학"],
    activities: ["실험 동아리", "과학탐구", "생태 관찰"],
    books: ["생명과학 입문", "유전자 관련 도서"],
    projects: ["생명과학 실험", "생태 조사 프로젝트"],
  },
  화학과: {
    subjects: ["화학", "수학", "물리학"],
    activities: ["실험 활동", "화학 탐구", "발표"],
    books: ["화학의 기초", "실험 관련 도서"],
    projects: ["화학 실험 설계", "재료 분석 프로젝트"],
  },
  물리학과: {
    subjects: ["물리학", "수학", "미적분"],
    activities: ["물리 탐구", "실험 설계", "문제 해결 활동"],
    books: ["물리학 입문", "우주/에너지 관련 도서"],
    projects: ["물리 실험", "에너지 관련 프로젝트"],
  },
};

const departmentOptions = [
  "기계공학과",
  "컴퓨터공학과",
  "국어교육과",
  "영어교육과",
  "초등교육과",
  "의예과",
  "간호학과",
  "경영학과",
  "경제학과",
  "심리학과",
  "생명과학과",
  "화학과",
  "물리학과",
  "기타",
];

const defaultGuide: GoalGuide = {
  subjects: ["국어", "영어", "수학", "사회/과학"],
  activities: ["독서 활동", "토론 활동", "탐구 활동"],
  books: ["전공 관련 입문서"],
  projects: ["관심 분야 탐구 프로젝트"],
};

export default function GoalPage() {
  const savedGoal = JSON.parse(localStorage.getItem("goalInfo") || "{}");

  const [university, setUniversity] = useState(savedGoal.university || "");
  const [customUniversity, setCustomUniversity] = useState(
    savedGoal.customUniversity || ""
  );
  const [department, setDepartment] = useState(savedGoal.department || "");
  const [customDepartment, setCustomDepartment] = useState(
    savedGoal.customDepartment || ""
  );
  const [savedMessage, setSavedMessage] = useState("");

  const finalUniversity =
    university === "기타" ? customUniversity.trim() : university;
  const finalDepartment =
    department === "기타" ? customDepartment.trim() : department;

  const guide = useMemo(() => {
    if (finalDepartment && departmentGuideMap[finalDepartment]) {
      return departmentGuideMap[finalDepartment];
    }
    return defaultGuide;
  }, [finalDepartment]);

  const handleSave = () => {
    if (!finalUniversity) {
      alert("대학을 선택하거나 입력해주세요.");
      return;
    }

    if (!finalDepartment) {
      alert("학과를 선택하거나 입력해주세요.");
      return;
    }

    const goalInfo = {
      university,
      customUniversity,
      department,
      customDepartment,
      finalUniversity,
      finalDepartment,
    };

    localStorage.setItem("goalInfo", JSON.stringify(goalInfo));
    setSavedMessage("목표 대학/학과가 저장되었습니다.");
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>목표 대학 · 학과 설정</h2>
      <p style={{ color: "#6b7280", marginTop: "6px", marginBottom: "18px" }}>
        가고 싶은 대학과 학과를 먼저 정하면, 이후 탭에서 더 맞춤형 가이드를
        받을 수 있습니다.
      </p>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "18px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>목표 입력</h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          대학
        </label>
        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <option value="">대학 선택</option>
          {universityOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {university === "기타" && (
          <input
            type="text"
            placeholder="대학명 직접 입력"
            value={customUniversity}
            onChange={(e) => setCustomUniversity(e.target.value)}
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
        )}

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          학과
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "16px",
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <option value="">학과 선택</option>
          {departmentOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {department === "기타" && (
          <input
            type="text"
            placeholder="학과명 직접 입력"
            value={customDepartment}
            onChange={(e) => setCustomDepartment(e.target.value)}
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
        )}

        <button onClick={handleSave}>저장</button>

        {savedMessage && (
          <p style={{ color: "#2563eb", marginTop: "12px", fontWeight: 600 }}>
            {savedMessage}
          </p>
        )}
      </div>

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
          현재 목표
        </div>
        <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px" }}>
          {finalUniversity || "대학 미설정"}
        </div>
        <div style={{ fontSize: "20px", fontWeight: 700, marginTop: "4px" }}>
          {finalDepartment || "학과 미설정"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>중요 교과</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.subjects.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>추천 활동</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.activities.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>추천 독서</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.books.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>추천 프로젝트</h3>
          <ul style={{ paddingLeft: "18px", marginBottom: 0 }}>
            {guide.projects.map((item) => (
              <li key={item} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}