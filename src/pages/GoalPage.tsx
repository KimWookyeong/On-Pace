import { useEffect, useMemo, useState } from "react";

interface GoalGuide {
  subjects: string[];
  activities: string[];
  books: string[];
  projects: string[];
}

const universityList = [
  "서울대학교",
  "연세대학교",
  "고려대학교",
  "서강대학교",
  "성균관대학교",
  "한양대학교",
  "중앙대학교",
  "경희대학교",
  "한국외국어대학교",
  "서울시립대학교",
  "이화여자대학교",
  "건국대학교",
  "동국대학교",
  "홍익대학교",
  "숙명여자대학교",
  "국민대학교",
  "숭실대학교",
  "세종대학교",
  "단국대학교",
  "광운대학교",
  "명지대학교",
  "상명대학교",
  "가톨릭대학교",
  "인하대학교",
  "아주대학교",
  "경기대학교",
  "가천대학교",
  "한성대학교",
  "덕성여자대학교",
  "동덕여자대학교",
  "성신여자대학교",
  "부산대학교",
  "부경대학교",
  "동아대학교",
  "경북대학교",
  "영남대학교",
  "계명대학교",
  "전남대학교",
  "전북대학교",
  "충남대학교",
  "충북대학교",
  "강원대학교",
  "제주대학교",
  "한국교원대학교",
  "서울교육대학교",
  "부산교육대학교",
  "진주교육대학교",
  "경인교육대학교",
  "춘천교육대학교",
  "공주교육대학교",
  "대구교육대학교",
  "광주교육대학교",
  "청주교육대학교",
  "한국과학기술원",
  "포항공과대학교",
  "울산과학기술원",
  "대구경북과학기술원",
  "광주과학기술원",
];

const departmentList = [
  "국어국문학과",
  "영어영문학과",
  "사학과",
  "철학과",
  "중어중문학과",
  "일어일문학과",
  "불어불문학과",
  "독어독문학과",
  "교육학과",
  "국어교육과",
  "영어교육과",
  "수학교육과",
  "유아교육과",
  "초등교육과",
  "역사교육과",
  "윤리교육과",
  "사회교육과",
  "지리교육과",
  "물리교육과",
  "화학교육과",
  "생물교육과",
  "지구과학교육과",
  "경영학과",
  "경제학과",
  "회계학과",
  "무역학과",
  "행정학과",
  "정치외교학과",
  "사회학과",
  "미디어커뮤니케이션학과",
  "심리학과",
  "아동학과",
  "소비자학과",
  "법학과",
  "수학과",
  "통계학과",
  "물리학과",
  "화학과",
  "생명과학과",
  "지구과학과",
  "생명공학과",
  "화학공학과",
  "신소재공학과",
  "기계공학과",
  "전기전자공학과",
  "전자공학과",
  "컴퓨터공학과",
  "소프트웨어학과",
  "인공지능학과",
  "산업공학과",
  "건축학과",
  "토목공학과",
  "환경공학과",
  "도시공학과",
  "의예과",
  "의학과",
  "치의예과",
  "한의예과",
  "약학과",
  "간호학과",
  "수의예과",
  "식품영양학과",
  "식품공학과",
  "의공학과",
  "체육교육과",
  "체육학과",
  "미술학과",
  "디자인학과",
  "산업디자인학과",
  "시각디자인학과",
  "음악학과",
  "작곡과",
  "성악과",
  "피아노과",
  "연극영화학과",
  "패션디자인학과",
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
  소프트웨어학과: {
    subjects: ["수학", "정보", "확률과 통계", "미적분"],
    activities: ["코딩 동아리", "알고리즘 탐구", "앱 개발 활동"],
    books: ["클린 코드", "컴퓨팅 사고 관련 도서"],
    projects: ["앱 개발", "웹 개발", "코딩 프로젝트"],
  },
  인공지능학과: {
    subjects: ["수학", "정보", "확률과 통계", "미적분"],
    activities: ["AI 탐구", "코딩 활동", "데이터 분석"],
    books: ["인공지능 개론", "머신러닝 입문"],
    projects: ["AI 모델 실험", "데이터 분석 프로젝트"],
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
  교육학과: {
    subjects: ["국어", "영어", "사회"],
    activities: ["멘토링", "봉사", "교육 토론"],
    books: ["교육학 개론", "교육사회학 관련 도서"],
    projects: ["교육 프로그램 기획", "학습 지원 프로젝트"],
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
  약학과: {
    subjects: ["화학", "생명과학", "수학"],
    activities: ["화학 실험", "생명과학 탐구", "의약 관련 활동"],
    books: ["약학 개론", "생화학 관련 도서"],
    projects: ["약물 탐구 프로젝트", "화학 실험 설계"],
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
  생명공학과: {
    subjects: ["생명과학", "화학", "수학"],
    activities: ["실험 동아리", "과학탐구", "생명공학 탐구"],
    books: ["생명공학 개론", "유전자 공학 관련 도서"],
    projects: ["유전자 실험 탐구", "바이오 데이터 분석"],
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

const defaultGuide: GoalGuide = {
  subjects: ["국어", "영어", "수학", "사회/과학"],
  activities: ["독서 활동", "토론 활동", "탐구 활동"],
  books: ["전공 관련 입문서"],
  projects: ["관심 분야 탐구 프로젝트"],
};

function PillList({
  items,
  color = "#eff6ff",
  textColor = "#1e3a8a",
}: {
  items: string[];
  color?: string;
  textColor?: string;
}) {
  return (
    <div className="pill-wrap">
      {items.map((item) => (
        <div
          key={item}
          className="pill"
          style={{ background: color, color: textColor }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function SuggestionList({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (value: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "-4px",
        marginBottom: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
      }}
    >
      {items.slice(0, 8).map((item, index) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          style={{
            width: "100%",
            textAlign: "left",
            background: "#fff",
            color: "#111827",
            borderRadius: 0,
            borderBottom: index !== items.slice(0, 8).length - 1 ? "1px solid #f3f4f6" : "none",
            boxShadow: "none",
            padding: "12px 14px",
            fontWeight: 500,
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function GoalPage() {
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("goalInfo") || "{}");
    if (saved.finalUniversity) {
      setUniversity(saved.finalUniversity || "");
      setDepartment(saved.finalDepartment || "");
    }
  }, []);

  const filteredUniversities = useMemo(() => {
    if (!university.trim()) return [];
    return universityList.filter((item) =>
      item.toLowerCase().includes(university.toLowerCase())
    );
  }, [university]);

  const filteredDepartments = useMemo(() => {
    if (!department.trim()) return [];
    return departmentList.filter((item) =>
      item.toLowerCase().includes(department.toLowerCase())
    );
  }, [department]);

  const guide = useMemo(() => {
    if (department && departmentGuideMap[department]) {
      return departmentGuideMap[department];
    }
    return defaultGuide;
  }, [department]);

  const handleSave = () => {
    if (!university.trim()) {
      alert("대학을 입력해주세요.");
      return;
    }

    if (!department.trim()) {
      alert("학과를 입력해주세요.");
      return;
    }

    const goalInfo = {
      university,
      department,
      finalUniversity: university.trim(),
      finalDepartment: department.trim(),
    };

    localStorage.setItem("goalInfo", JSON.stringify(goalInfo));
    setSavedMessage("목표 대학/학과가 저장되었습니다.");
    window.dispatchEvent(new Event("goalInfoUpdated"));
  };

  const handleLoad = () => {
    const saved = JSON.parse(localStorage.getItem("goalInfo") || "{}");

    if (!saved.finalUniversity) {
      alert("저장된 목표가 없습니다.");
      return;
    }

    setUniversity(saved.finalUniversity || "");
    setDepartment(saved.finalDepartment || "");
    setSavedMessage("저장된 목표를 불러왔습니다.");
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "목표를 삭제하면 현재 목표와 매칭률이 초기화됩니다.\n정말 삭제할까요?"
    );

    if (!confirmed) return;

    localStorage.removeItem("goalInfo");
    setUniversity("");
    setDepartment("");
    setSavedMessage("저장된 목표가 삭제되었습니다.");
    window.dispatchEvent(new Event("goalInfoUpdated"));
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>목표 대학 · 학과 설정</h2>
      <p className="muted" style={{ marginTop: "6px", marginBottom: "18px" }}>
        먼저 목표를 정하면 이후 성적과 활동을 더 전략적으로 준비할 수 있어요.
      </p>

      <div className="card section-gap">
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>목표 입력</h3>

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          대학 검색
        </label>
        <input
          type="text"
          placeholder="예: 연세대학교, 부산대학교"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
        <SuggestionList items={filteredUniversities} onSelect={setUniversity} />

        <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
          학과 검색
        </label>
        <input
          type="text"
          placeholder="예: 생명과학과, 컴퓨터공학과"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <SuggestionList items={filteredDepartments} onSelect={setDepartment} />

        <div className="top-actions">
          <button onClick={handleSave}>목표 저장</button>

          <button type="button" className="ghost" onClick={handleLoad}>
            수정 불러오기
          </button>

          <button type="button" className="danger" onClick={handleDelete}>
            목표 삭제
          </button>
        </div>

        {savedMessage && (
          <p style={{ marginTop: "12px", color: "#2563eb", fontWeight: 600 }}>
            {savedMessage}
          </p>
        )}
      </div>

      <div className="card-grid-2">
        <div className="info-card">
          <h3 style={{ marginTop: 0 }}>중요 교과</h3>
          <PillList items={guide.subjects} />
        </div>

        <div className="info-card">
          <h3 style={{ marginTop: 0 }}>추천 활동</h3>
          <PillList items={guide.activities} color="#ecfdf5" textColor="#166534" />
        </div>

        <div className="info-card">
          <h3 style={{ marginTop: 0 }}>추천 독서</h3>
          <PillList items={guide.books} color="#fff7ed" textColor="#9a3412" />
        </div>

        <div className="info-card">
          <h3 style={{ marginTop: 0 }}>추천 프로젝트</h3>
          <PillList items={guide.projects} color="#f5f3ff" textColor="#5b21b6" />
        </div>
      </div>
    </div>
  );
}