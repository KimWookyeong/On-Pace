import { useMemo, useState } from 'react';

const projectGuideMap: Record<
  string,
  {
    ideas: string[];
    skills: string[];
    keywords: string[];
  }
> = {
  공학: {
    ideas: [
      '센서를 활용한 자동화 시스템 제작',
      '문제 해결형 기계 설계 프로젝트',
      '코딩 기반 프로그램 개발',
    ],
    skills: ['설계', '제작', '문제 해결', '코딩'],
    keywords: ['설계', '제작', '코딩', '시스템', '문제'],
  },
  교육: {
    ideas: [
      '수업 지도안 설계 프로젝트',
      '학습 멘토링 프로그램 운영',
      '교육 콘텐츠 제작',
    ],
    skills: ['설명', '기획', '소통', '멘토링'],
    keywords: ['수업', '멘토링', '설명', '교육', '지도'],
  },
  의치한약: {
    ideas: [
      '생명과학 실험 탐구 프로젝트',
      '건강 관련 데이터 분석',
      '의학 관련 독서 기반 탐구',
    ],
    skills: ['탐구', '실험', '분석', '자료 조사'],
    keywords: ['생명', '화학', '실험', '건강', '의학'],
  },
  자연: {
    ideas: [
      '과학 실험 기반 탐구',
      '환경 변화 분석 프로젝트',
      '데이터 기반 과학 탐구',
    ],
    skills: ['탐구', '분석', '실험'],
    keywords: ['실험', '관찰', '데이터', '탐구'],
  },
  인문: {
    ideas: [
      '문학 작품 비교 분석',
      '철학 주제 탐구',
      '사회 현상 글쓰기 프로젝트',
    ],
    skills: ['분석', '글쓰기', '해석'],
    keywords: ['문학', '분석', '글쓰기', '해석'],
  },
  사회: {
    ideas: [
      '경제 데이터 분석 프로젝트',
      '정책 비교 연구',
      '사회 문제 해결 아이디어',
    ],
    skills: ['분석', '기획', '비판적 사고'],
    keywords: ['경제', '정책', '사회', '분석'],
  },
};

function getMatchLevel(track: string, text: string) {
  const guide = projectGuideMap[track];
  if (!guide) return { score: 0, label: '보통' };

  const lower = text.replace(/\s/g, '');
  let score = 0;

  guide.keywords.forEach((keyword) => {
    if (lower.includes(keyword)) score += 1;
  });

  if (score >= 3) return { score, label: '높음' };
  if (score >= 1) return { score, label: '보통' };
  return { score, label: '낮음' };
}

export default function ProjectPage() {
  const basicInfo = JSON.parse(localStorage.getItem('basicInfo') || '{}');
  const track = basicInfo.track || '자연';

  const guide = projectGuideMap[track] || projectGuideMap['자연'];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const analysis = useMemo(() => {
    return getMatchLevel(track, title + ' ' + content);
  }, [track, title, content]);

  const getFeedback = () => {
    if (!title && !content) {
      return '추천 프로젝트를 참고하여 탐구 방향을 설정해보세요.';
    }

    if (analysis.label === '높음') {
      return '전공과 매우 잘 연결된 프로젝트입니다. 과정 중심으로 더 구체화하면 매우 좋은 학생부가 됩니다.';
    }

    if (analysis.label === '보통') {
      return '기본적인 연계는 있지만 탐구 과정과 문제 해결 과정을 더 강조하면 좋습니다.';
    }

    return '전공과의 연결성이 부족합니다. 추천 프로젝트 방향을 참고해 수정해보세요.';
  };

  const getExpressionTip = () => {
    if (track === '공학') {
      return '문제 해결 과정과 설계·제작 과정을 중심으로 작성하세요.';
    }
    if (track === '교육') {
      return '설명, 지도, 소통 과정이 드러나도록 작성하세요.';
    }
    if (track === '의치한약') {
      return '탐구 과정, 실험, 자료 분석 중심으로 작성하세요.';
    }
    return '탐구 과정과 배운 점이 드러나도록 작성하세요.';
  };

  return (
    <div>
      <h2>프로젝트 전략 가이드</h2>

      <div
        style={{
          background: '#eff6ff',
          padding: '16px',
          borderRadius: '16px',
          marginBottom: '20px',
        }}
      >
        <div>희망 계열</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{track}</div>
      </div>

      <h3>추천 프로젝트</h3>
      <ul>
        {guide.ideas.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <hr />

      <h3>내 프로젝트 입력</h3>

      <input
        placeholder="프로젝트 이름"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="프로젝트 내용 (무엇을 했는지)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          minHeight: '100px',
          width: '100%',
          padding: '14px',
          margin: '10px 0 14px',
          border: '1px solid #d1d5db',
          borderRadius: '10px',
          fontSize: '15px',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '16px',
          background: '#f8fafc',
        }}
      >
        <h3>AI 분석</h3>

        <p>연계도: {analysis.label}</p>
        <p>{getFeedback()}</p>

        <h4>작성 팁</h4>
        <p>{getExpressionTip()}</p>
      </div>
    </div>
  );
}
