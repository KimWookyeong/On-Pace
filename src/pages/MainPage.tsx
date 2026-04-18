import { useState } from 'react';
import InputPage from './InputPage';
import ClubPage from './ClubPage';
import ProjectPage from './ProjectPage';
import ReadingPage from './ReadingPage';

export default function MainPage() {
  const [tab, setTab] = useState('성적');

  const tabs = ['성적', '동아리', '독서', '수상', '프로젝트'];

  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>진로 전략 관리</h1>
      <p style={{ color: '#6b7280', marginTop: 0, marginBottom: '20px' }}>
        성적과 활동을 함께 관리하며 진로 전략을 설계해보세요.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              minHeight: '56px',
              padding: '10px 8px',
              border: 'none',
              borderRadius: '14px',
              background: tab === t ? '#2563eb' : '#e5e7eb',
              color: tab === t ? '#ffffff' : '#111827',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              marginTop: 0,
              boxShadow:
                tab === t ? '0 8px 20px rgba(37, 99, 235, 0.22)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
        }}
      >
        {tab === '성적' && <InputPage />}
        {tab === '동아리' && <ClubPage />}
        {tab === '독서' && <ReadingPage />}
        {tab === '수상' && <div>수상 탭은 다음 단계에서 연결할게요.</div>}
        {tab === '프로젝트' && <ProjectPage />}
      </div>
    </div>
  );
}
