import React, { useEffect, useMemo, useState } from "react";

type ExamType = "중간고사" | "기말고사";

type GradeRecord = {
  id: string;
  year: number;
  semester: 1 | 2;
  examType: ExamType;
  korean: number;
  math: number;
  english: number;
  science: number;
  social: number;
};

const defaultInput = {
  year: 1,
  semester: 1,
  examType: "중간고사" as ExamType,
  korean: 3,
  math: 3,
  english: 3,
  science: 3,
  social: 3,
};

export default function GradePage() {
  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [input, setInput] = useState(defaultInput);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 초기 로딩
  useEffect(() => {
    const saved = localStorage.getItem("gradeData");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  // 평균 계산
  const avg = (arr: number[]) =>
    Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  const overallAvg = useMemo(() => {
    if (records.length === 0) return 0;
    const all = records.map((r) =>
      avg([r.korean, r.math, r.english, r.science, r.social])
    );
    return avg(all);
  }, [records]);

  const handleChange = (key: string, value: number | string) => {
    setInput((prev: any) => ({ ...prev, [key]: value }));
  };

  const saveRecord = () => {
    const newRecord: GradeRecord = {
      id: editingId || Date.now().toString(),
      ...input,
    };

    const next = editingId
      ? records.map((r) => (r.id === editingId ? newRecord : r))
      : [...records, newRecord];

    setRecords(next);
    localStorage.setItem("gradeData", JSON.stringify(next));
    setEditingId(null);
    setInput(defaultInput);
  };

  const editRecord = (r: GradeRecord) => {
    setEditingId(r.id);
    setInput(r);
  };

  const deleteRecord = (id: string) => {
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    localStorage.setItem("gradeData", JSON.stringify(next));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 성적 관리</h2>

      {/* 입력 */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={input.year}
          onChange={(e) => handleChange("year", Number(e.target.value))}
        >
          <option value={1}>1학년</option>
          <option value={2}>2학년</option>
          <option value={3}>3학년</option>
        </select>

        <select
          value={input.semester}
          onChange={(e) => handleChange("semester", Number(e.target.value))}
        >
          <option value={1}>1학기</option>
          <option value={2}>2학기</option>
        </select>

        <select
          value={input.examType}
          onChange={(e) => handleChange("examType", e.target.value)}
        >
          <option value="중간고사">중간고사</option>
          <option value="기말고사">기말고사</option>
        </select>

        <div>
          국어{" "}
          <input
            type="number"
            value={input.korean}
            onChange={(e) =>
              handleChange("korean", Number(e.target.value))
            }
          />
          수학{" "}
          <input
            type="number"
            value={input.math}
            onChange={(e) =>
              handleChange("math", Number(e.target.value))
            }
          />
          영어{" "}
          <input
            type="number"
            value={input.english}
            onChange={(e) =>
              handleChange("english", Number(e.target.value))
            }
          />
          과학{" "}
          <input
            type="number"
            value={input.science}
            onChange={(e) =>
              handleChange("science", Number(e.target.value))
            }
          />
          사회{" "}
          <input
            type="number"
            value={input.social}
            onChange={(e) =>
              handleChange("social", Number(e.target.value))
            }
          />
        </div>

        <button onClick={saveRecord}>
          {editingId ? "수정 저장" : "저장"}
        </button>
      </div>

      {/* 평균 */}
      <h3>내신 평균: {overallAvg || "-"}</h3>

      {/* 목록 */}
      <table border={1} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>학년</th>
            <th>학기</th>
            <th>고사</th>
            <th>국어</th>
            <th>수학</th>
            <th>영어</th>
            <th>과학</th>
            <th>사회</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.year}</td>
              <td>{r.semester}</td>
              <td>{r.examType}</td>
              <td>{r.korean}</td>
              <td>{r.math}</td>
              <td>{r.english}</td>
              <td>{r.science}</td>
              <td>{r.social}</td>
              <td>
                <button onClick={() => editRecord(r)}>수정</button>
                <button onClick={() => deleteRecord(r.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}