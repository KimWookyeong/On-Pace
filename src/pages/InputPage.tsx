import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SubjectRecord {
  id: number;
  category: string;
  subject: string;
  score: number | '';
}

const subjectOptions: Record<string, string[]> = {
  국어: ['공통국어', '독서와 작문', '화법과 언어', '문학'],
  수학: ['공통수학', '대수', '미적분', '확률과 통계', '기하'],
  사회: [
    '통합사회',
    '한국사',
    '경제',
    '정치와 법',
    '사회문화',
    '한국지리',
    '세계지리',
  ],
  과학: ['통합과학', '물리학', '화학', '생명과학', '지구과학'],
  영어: ['공통영어', '영어Ⅰ', '영어Ⅱ'],
  예체능: ['음악', '미술', '체육'],
  기타: [],
};

export default function InputPage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [subjectMode, setSubjectMode] = useState<'select' | 'custom'>('select');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [score, setScore] = useState<number | ''>('');
  const [savedSubjects, setSavedSubjects] = useState<SubjectRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setCategory('');
    setSubjectMode('select');
    setSelectedSubject('');
    setCustomSubject('');
    setScore('');
    setEditingId(null);
  };

  const getFinalSubject = () => {
    return subjectMode === 'custom'
      ? customSubject.trim()
      : selectedSubject.trim();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSelectedSubject('');
    setCustomSubject('');
    setSubjectMode(subjectOptions[value]?.length ? 'select' : 'custom');
  };

  const handleSave = () => {
    const finalSubject = getFinalSubject();

    if (!category) {
      alert('영역을 선택해주세요.');
      return;
    }

    if (!finalSubject) {
      alert('세부 과목을 입력하거나 선택해주세요.');
      return;
    }

    if (score === '' || Number(score) <= 0) {
      alert('점수를 입력해주세요.');
      return;
    }

    if (editingId !== null) {
      setSavedSubjects((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                category,
                subject: finalSubject,
                score,
              }
            : item
        )
      );
    } else {
      setSavedSubjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          category,
          subject: finalSubject,
          score,
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: SubjectRecord) => {
    setCategory(item.category);

    const options = subjectOptions[item.category] || [];
    if (options.includes(item.subject)) {
      setSubjectMode('select');
      setSelectedSubject(item.subject);
      setCustomSubject('');
    } else {
      setSubjectMode('custom');
      setSelectedSubject('');
      setCustomSubject(item.subject);
    }

    setScore(item.score);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedSubjects((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const handleNext = () => {
    if (savedSubjects.length === 0) {
      alert('최소 1개 이상의 과목을 저장해주세요.');
      return;
    }

    const basicInfo = JSON.parse(localStorage.getItem('basicInfo') || '{}');

    const inputData = {
      ...basicInfo,
      subjects: savedSubjects,
    };

    localStorage.setItem('studentInput', JSON.stringify(inputData));
    navigate('/result');
  };

  return (
    <div className="page">
      <h2>과목별 성적 입력</h2>

      <label>영역</label>
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">영역 선택</option>
        <option value="국어">국어</option>
        <option value="수학">수학</option>
        <option value="사회">사회</option>
        <option value="과학">과학</option>
        <option value="영어">영어</option>
        <option value="예체능">예체능</option>
        <option value="기타">기타</option>
      </select>

      {category && subjectOptions[category]?.length > 0 && (
        <>
          <label>세부 과목 입력 방식</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setSubjectMode('select')}
              style={{
                flex: 1,
                marginTop: 0,
                background: subjectMode === 'select' ? '#2563eb' : '#9ca3af',
              }}
            >
              선택
            </button>
            <button
              type="button"
              onClick={() => setSubjectMode('custom')}
              style={{
                flex: 1,
                marginTop: 0,
                background: subjectMode === 'custom' ? '#2563eb' : '#9ca3af',
              }}
            >
              직접 입력
            </button>
          </div>
        </>
      )}

      {category &&
        subjectMode === 'select' &&
        subjectOptions[category]?.length > 0 && (
          <>
            <label>세부 과목</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">세부 과목 선택</option>
              {subjectOptions[category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </>
        )}

      {category &&
        (subjectMode === 'custom' ||
          subjectOptions[category]?.length === 0) && (
          <>
            <label>세부 과목 직접 입력</label>
            <input
              type="text"
              placeholder="예: 언어와 매체, 심화수학, 생활과 과학"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                margin: '10px 0 14px',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
          </>
        )}

      <label>점수</label>
      <input
        type="number"
        placeholder="점수 입력"
        value={score}
        onChange={(e) =>
          setScore(e.target.value === '' ? '' : Number(e.target.value))
        }
        style={{
          width: '100%',
          padding: '14px',
          margin: '10px 0 14px',
          border: '1px solid #d1d5db',
          borderRadius: '10px',
          fontSize: '18px',
          boxSizing: 'border-box',
        }}
      />

      <button onClick={handleSave}>
        {editingId !== null ? '수정 완료' : '저장'}
      </button>

      {editingId !== null && (
        <button
          type="button"
          onClick={resetForm}
          style={{ background: '#6b7280' }}
        >
          수정 취소
        </button>
      )}

      <hr
        style={{
          margin: '24px 0',
          border: 'none',
          borderTop: '1px solid #e5e7eb',
        }}
      />

      <h3>저장된 과목</h3>

      {savedSubjects.length === 0 ? (
        <p>아직 저장된 과목이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {savedSubjects.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '14px',
                background: '#f9fafb',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                {item.category} / {item.subject}
              </div>
              <div style={{ marginBottom: '10px' }}>{item.score}점</div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  style={{ flex: 1, marginTop: 0, background: '#2563eb' }}
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  style={{ flex: 1, marginTop: 0, background: '#ef4444' }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleNext} style={{ marginTop: '24px' }}>
        결과 보기
      </button>
    </div>
  );
}
