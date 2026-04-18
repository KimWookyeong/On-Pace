import type { StudentInput, AnalysisResult } from '../types/student';

export function analyzeStudent(data: StudentInput): AnalysisResult {
  const activityCount = [
    data.hasClub,
    data.hasAward,
    data.hasReading,
    data.hasProject,
  ].filter(Boolean).length;

  let type = '보완형';
  let summary = '';
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (data.gpaLevel <= 2 && activityCount >= 2) {
    type = '수시형';
    summary = '학생부 중심 전형이 유리합니다.';
    strengths.push('내신 경쟁력이 있습니다.');
    strengths.push('활동이 비교적 잘 갖춰져 있습니다.');
  } else if (data.gpaLevel >= 4 && data.mockExam === 'strong') {
    type = '정시형';
    summary = '정시 중심 전략이 더 유리할 수 있습니다.';
    strengths.push('모의고사 경쟁력이 강점입니다.');
    weaknesses.push('수시 대비 활동 보완이 필요합니다.');
  } else if (data.gpaLevel <= 3 && activityCount >= 1) {
    type = '전략형';
    summary = '5등급제에서는 성적과 활동을 함께 설계하는 전략이 중요합니다.';
    strengths.push('기본 학업 경쟁력이 있습니다.');
    strengths.push('수시 준비 가능성이 있습니다.');
    weaknesses.push('전공 관련 활동을 더 구체화할 필요가 있습니다.');
  } else {
    type = '보완형';
    summary = '전반적인 보완이 필요한 상태입니다.';
    weaknesses.push('내신 또는 활동 보완이 필요합니다.');
  }

  if (!data.attendanceGood) {
    weaknesses.push('출결 관리가 중요합니다.');
  }

  if (data.track === '공학' && !data.hasProject) {
    weaknesses.push('공학 계열은 프로젝트 경험이 있으면 더 좋습니다.');
  }

  if (data.track === '교육' && !data.hasReading) {
    weaknesses.push('교육 계열은 독서와 지속적인 활동이 중요합니다.');
  }

  if (data.track === '의치한약' && activityCount < 2) {
    weaknesses.push('의·치·한·약 계열은 전공 연계 활동의 방향성이 중요합니다.');
  }

  return {
    type,
    summary,
    strengths,
    weaknesses,
    premiumHint: [
      '전형별 상세 전략 보기',
      '추천 과목 보기',
      '추천 독서 및 활동 보기',
    ],
  };
}
