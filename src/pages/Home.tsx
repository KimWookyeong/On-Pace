import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>진로 전략 가이드</h1>
      <p>3분 만에 나의 입시 전략을 확인해보세요.</p>
      <button onClick={() => navigate('/basic')}>시작하기</button>
    </div>
  );
}
