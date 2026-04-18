import { useMemo, useState } from 'react';

interface ReadingRecord {
  id: number;
  book: string;
  content: string;
}

const readingGuideMap: Record<
  string,
  {
    books: string[];
    keywords: string[];
  }
> = {
  공학: {
    books: ['코스모스', '수학의 정석', '클린 코드'],
    keywords: ['수학', '과학', '기술', '코딩', '문제', '설계'],
  },
  교육: {
    books: ['교육학 개론', '어린왕자', '페다고지'],
    keywords: ['교육', '성장', '지도', '학습', '소통', '수업'],
  },
  의치한약: {
    books: ['이기적 유전자', '생명이란 무엇인가'],
    keywords: ['생명', '의학', '건강', '유전자', '실험'],
  },
  자연: {
    books: ['과학 콘서트', '부분과 전체', '침묵의 봄'],
    keywords: ['과학', '탐구', '자연', '실험', '관찰'],
  },
  인문: {
    books: ['총, 균, 쇠', '사피엔스'],
    keywords: ['역사', '문화', '인문', '문명', '철학'],
  },
  사회: {
    books: ['정의란 무엇인가', '공정하다는 착각'],
    keywords: ['사회', '정의', '정치', '경제', '정책'],
  },
  예체능: {
    books: ['예술의 쓸모', '체육의 역사'],
    keywords: ['예술', '창작', '표현', '체육', '감각'],
  },
};

function getMatchLevel(track: string, text: string) {
  const guide = readingGuideMap[track];
  if (!guide) return { label: '보통' as const };

  const joined = text.replace(/\s/g, '');
  let score = 0;

  guide.keywords.forEach((keyword) => {
    if (joined.includes(keyword)) score += 1;
  });

  if (score >= 2) return { label: '높음' as const };
  if (score >= 1) return { label: '보통' as const };
  return { label: '낮음' as const };
}

export default function ReadingPage() {
  const basicInfo = JSON.parse(localStorage.getItem('basicInfo') || '{}');
  const track = basicInfo.track || '자연';
  const guide = readingGuideMap[track] || readingGuideMap['자연'];

  const [book, setBook] = useState('');
  const [content, setContent] = useState('');
  const [savedReadings, setSavedReadings] = useState<ReadingRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const analysis = useMemo(() => {
    return getMatchLevel(track, `${book} ${content}`);
  }, [track, book, content]);

  const resetForm = () => {
    setBook('');
    setContent('');
    setEditingId(null);
  };

  const handleSave = () => {
    if (!book.trim()) {
      alert('책 제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용 요약 및 느낀 점을 입력해주세요.');
      return;
    }

    if (editingId !== null) {
      setSavedReadings((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                book: book.trim(),
                content: content.trim(),
              }
            : item
        )
      );
    } else {
      setSavedReadings((prev) => [
        ...prev,
        {
          id: Date.now(),
          book: book.trim(),
          content: content.trim(),
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item: ReadingRecord) => {
    setBook(item.book);
    setContent(item.content);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => {
    setSavedReadings((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const getFeedback = () => {
    if (!book && !content) {
      return '추천 도서를 참고해 읽을 책을 고르고, 읽은 뒤에는 핵심 내용과 진로 연결점을 정리해보세요.';
    }
    if (analysis.label === '높음') {
      return '희망 계열과 잘 연결된 독서입니다. 내용 요약보다 왜 이 책이 진로와 연결되는지를 더 강조하면 좋습니다.';
    }
    if (analysis.label === '보통') {
      return '기본적인 연계성은 있습니다. 책에서 얻은 생각을 진로와 조금 더 구체적으로 연결해보세요.';
    }
    return '현재 입력 내용만으로는 희망 계열과의 연결성이 약합니다. 추천 도서를 참고해 방향을 보완해보세요.';
  };

  const getTip = () => {
    return '책 내용 요약 → 인상 깊은 부분 → 나의 생각 → 진로와의 연결 순서로 쓰면 훨씬 좋습니다.';
  };

  const badgeStyle =
    analysis.label === '높음'
      ? { background: '#dcfce7', color: '#166534' }
      : analysis.label === '보통'
      ? { background: '#fef3c7', color: '#92400e' }
      : { background: '#fee2e2', color: '#991b1b' };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>독서 전략 가이드</h2>
      <p style={{ color: '#6b7280', marginTop: '6px', marginBottom: '18px' }}>
        희망 계열에 맞는 독서 방향을 확인하고, 읽은 책을 진로와 연결해보세요.
      </p>

      <div
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '18px',
        }}
      >
        <div style={{ fontSize: '14px', color: '#1d4ed8', fontWeight: 700 }}>
          희망 계열
        </div>
        <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px' }}>
          {track}
        </div>
      </div>

      <div
        style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '18px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '12px' }}>추천 도서</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {guide.books.map((b) => (
            <div
              key={b}
              style={{
                padding: '10px 14px',
                borderRadius: '999px',
                background: '#ffffff',
                border: '1px solid #dbeafe',
                color: '#1e3a8a',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '18px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '14px' }}>
          {editingId !== null ? '독서 기록 수정' : '내 독서 입력'}
        </h3>

        <label
          style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}
        >
          책 제목
        </label>
        <input
          type="text"
          placeholder="예: 과학 콘서트"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />

        <label
          style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}
        >
          내용 요약 및 느낀 점
        </label>
        <textarea
          placeholder="책의 핵심 내용, 인상 깊은 부분, 진로와 연결되는 생각을 적어보세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: '100%',
            minHeight: '140px',
            padding: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '15px',
            boxSizing: 'border-box',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.6,
          }}
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button onClick={handleSave} style={{ flex: 1, marginTop: 0 }}>
            {editingId !== null ? '수정 완료' : '저장'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                flex: 1,
                marginTop: 0,
                background: '#6b7280',
              }}
            >
              수정 취소
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '18px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '14px' }}>AI 분석</h3>

        <div
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            borderRadius: '999px',
            fontWeight: 700,
            marginBottom: '14px',
            ...badgeStyle,
          }}
        >
          연계도 {analysis.label}
        </div>

        <p style={{ lineHeight: 1.7, marginTop: 0 }}>{getFeedback()}</p>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '14px',
            marginTop: '14px',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '8px' }}>작성 팁</div>
          <div style={{ color: '#374151', lineHeight: 1.7 }}>{getTip()}</div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '18px',
          padding: '18px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '14px' }}>저장된 독서 기록</h3>

        {savedReadings.length === 0 ? (
          <p style={{ color: '#6b7280', marginBottom: 0 }}>
            아직 저장된 독서 기록이 없습니다.
          </p>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {savedReadings.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '14px',
                  background: '#f9fafb',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    marginBottom: '8px',
                  }}
                >
                  {item.book}
                </div>
                <div
                  style={{
                    color: '#374151',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {item.content}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      marginTop: 0,
                      background: '#2563eb',
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      flex: 1,
                      marginTop: 0,
                      background: '#ef4444',
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
