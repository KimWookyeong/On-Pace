import { useNavigate } from 'react-router-dom';

export default function ResultPage() {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('studentInput') || '{}');

  const subjects = data.subjects || [];
  const track = data.track;

  // 평균
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

  // 계열별 필수 과목
  const requiredMap: any = {
    공학: ['수학', '과학'],
    교육: ['국어', '영어'],
    의치한약: ['과학'],
    자연: ['수학', '과학'],
    인문: ['국어', '사회'],
    사회: ['사회', '국어'],
  };

  const required = requiredMap[track] || [];

  const analysisMessages: string[] = [];

  required.forEach((req: string) => {
    const related = subjects.filter((s: any) => s.category === req);

    if (related.length === 0) {
      analysisMessages.push(
        `⚠️ ${req} 과목이 없습니다. 반드시 준비가 필요합니다.`
      );
    } else {
      const avgScore =
        related.reduce((sum: number, s: any) => sum + s.score, 0) /
        related.length;

      if (avgScore < 70) {
        analysisMessages.push(
          `⚠️ ${req} 성적이 낮습니다. 집중 보완이 필요합니다.`
        );
      } else if (avgScore > 85) {
        analysisMessages.push(`🔥 ${req} 계열이 강점입니다.`);
      }
    }
  });

  // 🔥 추천 과목
  const subjectRecommend: any = {
    공학: ['미적분', '물리학'],
    교육: ['문학', '영어Ⅱ'],
    의치한약: ['생명과학', '화학'],
    자연: ['미적분', '과학탐구'],
    인문: ['문학', '사회문화'],
    사회: ['경제', '정치와 법'],
  };

  // 🔥 추천 활동
  const activityRecommend: any = {
    공학: ['과학 탐구 프로젝트', '코딩 활동'],
    교육: ['멘토링 봉사', '독서 토론 활동'],
    의치한약: ['생명과학 실험 탐구', '의학 관련 독서'],
    자연: ['과학 실험 활동'],
    인문: ['독서 활동', '글쓰기 활동'],
    사회: ['시사 토론', '경제 뉴스 분석'],
  };

  // 🔥 추천 독서
  const bookRecommend: any = {
    공학: ['수학의 정석', '코딩 관련 입문서'],
    교육: ['교육학 개론', '어린왕자'],
    의치한약: ['이기적 유전자', '생명이란 무엇인가'],
    자연: ['과학 콘서트'],
    인문: ['총, 균, 쇠'],
    사회: ['정의란 무엇인가'],
  };

  return (
    <div className="page">
      <h2>분석 결과</h2>

      <h3>📊 평균 점수</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{avg}점</p>

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
      <ul>
        {analysisMessages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>

      <h3>📘 추천 과목</h3>
      <ul>
        {(subjectRecommend[track] || []).map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3>🧪 추천 활동</h3>
      <ul>
        {(activityRecommend[track] || []).map((a: string, i: number) => (
          <li key={i}>{a}</li>
        ))}
      </ul>

      <h3>📚 추천 독서</h3>
      <ul>
        {(bookRecommend[track] || []).map((b: string, i: number) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <button onClick={() => navigate('/input')}>다시 입력</button>
      <button onClick={() => navigate('/')}>처음으로</button>
    </div>
  );
}
