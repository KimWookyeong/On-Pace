export type GoalForm = {
    university: string;
    major: string;
    track: string;
    gpa: number | null;
    mockExam: number | null;
    activitiesScore: number | null;
    majorFitScore: number | null;
    essayScore: number | null;
    practicalScore: number | null;
  };
  
  export type GradeRecord = {
    id: string;
    year: 1 | 2 | 3;
    semester: 1 | 2;
    examType: "중간고사" | "기말고사";
    area: "국어" | "수학" | "영어" | "사회" | "과학";
    subject: string;
    score: number;
    savedAt: string;
  };
  
  export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    text: string;
    createdAt: string;
  };
  
  export const GOAL_KEY = "goalData";
  export const GRADE_KEY = "gradeData";
  export const CHAT_KEY = "aiChatData";
  
  export const UNIVERSITY_LIST = [
    "서울대학교",
    "연세대학교",
    "고려대학교",
    "성균관대학교",
    "한양대학교",
    "중앙대학교",
    "경희대학교",
    "한국외국어대학교",
    "서울시립대학교",
    "부산대학교",
    "경북대학교",
    "전남대학교",
    "충남대학교",
    "충북대학교",
    "부경대학교",
    "동아대학교",
    "영남대학교",
    "이화여자대학교",
    "숙명여자대학교",
    "홍익대학교",
    "건국대학교",
    "동국대학교",
    "아주대학교",
    "인하대학교",
    "가천대학교",
    "단국대학교",
    "국민대학교",
    "숭실대학교",
    "세종대학교",
    "광운대학교",
  ];
  
  export const MAJOR_LIST = [
    "국제학과",
    "경영학과",
    "경제학과",
    "행정학과",
    "정치외교학과",
    "미디어커뮤니케이션학과",
    "심리학과",
    "교육학과",
    "영어영문학과",
    "국어국문학과",
    "사회학과",
    "법학과",
    "컴퓨터공학과",
    "소프트웨어학과",
    "인공지능학과",
    "전자공학과",
    "기계공학과",
    "산업공학과",
    "건축학과",
    "화학공학과",
    "생명공학과",
    "수학과",
    "물리학과",
    "화학과",
    "생명과학과",
    "간호학과",
    "의예과",
    "약학과",
    "디자인학과",
    "시각디자인학과",
    "체육교육과",
    "실용음악과",
  ];
  
  export const SUBJECT_MAP: Record<string, string[]> = {
    국어: ["국어", "문학", "독서", "화법과 작문", "언어와 매체"],
    수학: ["수학", "수학Ⅰ", "수학Ⅱ", "미적분", "확률과 통계", "기하"],
    영어: ["영어", "영어Ⅰ", "영어Ⅱ", "영어 독해와 작문"],
    사회: ["통합사회", "한국지리", "세계지리", "생활과 윤리", "사회문화", "정치와 법", "경제"],
    과학: ["통합과학", "물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ"],
  };
  
  export function saveGoal(data: GoalForm) {
    localStorage.setItem(GOAL_KEY, JSON.stringify(data));
  }
  
  export function loadGoal(): GoalForm | null {
    try {
      const raw = localStorage.getItem(GOAL_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  
  export function saveGrades(records: GradeRecord[]) {
    localStorage.setItem(GRADE_KEY, JSON.stringify(records));
  }
  
  export function loadGrades(): GradeRecord[] {
    try {
      const raw = localStorage.getItem(GRADE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  
  export function saveChat(messages: ChatMessage[]) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }
  
  export function loadChat(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  
  export function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  
  export function average(values: number[]) {
    if (!values.length) return 0;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  }
  
  export function gradeToScore(grade: number) {
    return Math.max(0, Math.min(100, 100 - grade * 10));
  }
  
  export function calcMatchingRates(goal: GoalForm) {
    if (
      goal.gpa == null ||
      goal.mockExam == null ||
      goal.activitiesScore == null ||
      goal.majorFitScore == null
    ) {
      return null;
    }
  
    const gpaScore = gradeToScore(goal.gpa);
    const mockScore = gradeToScore(goal.mockExam);
  
    const schoolRecord = gpaScore * 0.8 + (goal.activitiesScore ?? 0) * 0.2;
    const holistic =
      (goal.activitiesScore ?? 0) * 0.4 +
      (goal.majorFitScore ?? 0) * 0.4 +
      gpaScore * 0.2;
    const essay = (goal.essayScore ?? 50) * 0.6 + gpaScore * 0.4;
    const csat = mockScore;
    const practical = (goal.practicalScore ?? 50) * 0.7 + (goal.activitiesScore ?? 0) * 0.3;
  
    return {
      "학생부 교과": Math.round(Math.max(0, Math.min(100, schoolRecord))),
      "학생부 종합": Math.round(Math.max(0, Math.min(100, holistic))),
      논술: Math.round(Math.max(0, Math.min(100, essay))),
      정시: Math.round(Math.max(0, Math.min(100, csat))),
      "실기/실적": Math.round(Math.max(0, Math.min(100, practical))),
    };
  }
  
  export function getTopStrategies(rates: Record<string, number>) {
    return Object.entries(rates).sort((a, b) => b[1] - a[1]);
  }
  
  export function getRecommendationsByMajor(major: string) {
    const engineering = ["컴퓨터공학과", "소프트웨어학과", "인공지능학과", "전자공학과", "기계공학과", "산업공학과", "건축학과", "화학공학과"];
    const social = ["국제학과", "경영학과", "경제학과", "행정학과", "정치외교학과", "미디어커뮤니케이션학과", "사회학과", "법학과"];
    const science = ["수학과", "물리학과", "화학과", "생명과학과", "생명공학과"];
    const medical = ["간호학과", "의예과", "약학과"];
    const art = ["디자인학과", "시각디자인학과", "체육교육과", "실용음악과"];
  
    if (engineering.includes(major)) {
      return {
        importantSubjects: ["수학", "영어", "과학"],
        activities: ["코딩 활동", "탐구 활동", "프로젝트 활동"],
        books: ["공학 관련 입문서", "AI·SW 기초 도서"],
        projects: ["앱 제작 프로젝트", "문제 해결형 탐구 프로젝트"],
      };
    }
    if (social.includes(major)) {
      return {
        importantSubjects: ["국어", "영어", "사회"],
        activities: ["토론 활동", "독서 활동", "탐구 활동"],
        books: ["사회과학 입문서", "시사·정책 관련 도서"],
        projects: ["사회 이슈 분석 프로젝트", "미디어 콘텐츠 제작 프로젝트"],
      };
    }
    if (science.includes(major)) {
      return {
        importantSubjects: ["수학", "과학", "영어"],
        activities: ["실험 활동", "탐구 활동", "독서 활동"],
        books: ["과학 입문서", "실험·탐구 관련 도서"],
        projects: ["실험 설계 프로젝트", "데이터 분석 프로젝트"],
      };
    }
    if (medical.includes(major)) {
      return {
        importantSubjects: ["과학", "영어", "국어"],
        activities: ["생명과학 탐구", "봉사 활동", "독서 활동"],
        books: ["의학·보건 입문서", "생명윤리 도서"],
        projects: ["건강 캠페인 프로젝트", "생명과학 탐구 프로젝트"],
      };
    }
    if (art.includes(major)) {
      return {
        importantSubjects: ["국어", "영어", "실기 관련 과목"],
        activities: ["포트폴리오 활동", "창작 활동", "발표 활동"],
        books: ["예술 입문서", "표현·창작 관련 도서"],
        projects: ["포트폴리오 제작 프로젝트", "전시·발표 프로젝트"],
      };
    }
  
    return {
      importantSubjects: [],
      activities: [],
      books: [],
      projects: [],
    };
  }