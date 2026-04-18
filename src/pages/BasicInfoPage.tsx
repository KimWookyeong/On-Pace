import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const [gradeYear, setGradeYear] = useState('고1');
  const [track, setTrack] = useState('자연');

  const handleNext = () => {
    localStorage.setItem('basicInfo', JSON.stringify({ gradeYear, track }));
    navigate('/main');
  };

  return (
    <div className="page">
      <h2>기본 정보</h2>

      <label>학년</label>
      <select value={gradeYear} onChange={(e) => setGradeYear(e.target.value)}>
        <option value="고1">고1</option>
        <option value="고2">고2</option>
        <option value="고3">고3</option>
      </select>

      <label>희망 계열</label>
      <select value={track} onChange={(e) => setTrack(e.target.value)}>
        <option value="인문">인문</option>
        <option value="사회">사회</option>
        <option value="교육">교육</option>
        <option value="자연">자연</option>
        <option value="공학">공학</option>
        <option value="의치한약">의·치·한·약</option>
        <option value="예체능">예체능</option>
      </select>

      <button onClick={handleNext}>다음</button>
    </div>
  );
}
