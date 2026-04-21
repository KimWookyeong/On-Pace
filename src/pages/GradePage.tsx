import { useEffect, useMemo, useState } from "react";
import {
  GradeRecord,
  SUBJECT_MAP,
  average,
  loadGrades,
  makeId,
  saveGrades,
} from "../utils/onpaceStorage";

type Area = "국어" | "수학" | "영어" | "사회" | "과학";

const initialInput = {
  year: 1 as 1 | 2 | 3,
  semester: 1 as 1 | 2,
  examType: "중간고사" as "중간고사" | "기말고사",
  area: "국어" as Area,
  subject: "국어",
  score: 3,
};

export default function GradePage() {
  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState(initialInput);

  useEffect(() => {
    setRecords(loadGrades());
  }, []);

  const currentSubjects = SUBJECT_MAP[input.area];

  const handleSave = () => {
    const record: GradeRecord = {
      id: editingId || makeId(),
      year: input.year,
      semester: input.semester,
      examType: input.examType,
      area: input.area,
      subject: input.subject,
      score: Number(input.score),
      savedAt: new Date().toISOString(),
    };

    const next = editingId
      ? records.map((r) => (r.id === editingId ? record : r))
      : [...records, record];

    setRecords(next);
    saveGrades(next);
    setEditingId(null);
    setInput(initialInput);
  };

  const handleEdit = (record: GradeRecord) => {
    setEditingId(record.id);
    setInput({
      year: record.year,
      semester: record.semester,
      examType: record.examType,
      area: record.area,
      subject: record.subject,
      score: record.score,
    });
  };

  const handleDelete = (id: string) => {
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    saveGrades(next);
  };

  const overallAverage = useMemo(() => {
    if (!records.length) return 0;
    return average(records.map((r) => r.score));
  }, [records]);

  return (
    <div>
      <h3>📊 성적 입력</h3>

      <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
        <select value={input.year} onChange={(e) => setInput({ ...input, year: Number(e.target.value) as 1 | 2 | 3 })}>
          <option value={1}>1학년</option>
          <option value={2}>2학년</option>
          <option value={3}>3학년</option>
        </select>

        <select value={input.semester} onChange={(e) => setInput({ ...input, semester: Number(e.target.value) as 1 | 2 })}>
          <option value={1}>1학기</option>
          <option value={2}>2학기</option>
        </select>

        <select value={input.examType} onChange={(e) => setInput({ ...input, examType: e.target.value as "중간고사" | "기말고사" })}>
          <option value="중간고사">중간고사</option>
          <option value="기말고사">기말고사</option>
        </select>

        <select
          value={input.area}
          onChange={(e) => {
            const area = e.target.value as Area;
            setInput({
              ...input,
              area,
              subject: SUBJECT_MAP[area][0],
            });
          }}
        >
          <option value="국어">국어</option>
          <option value="수학">수학</option>
          <option value="영어">영어</option>
          <option value="사회">사회</option>
          <option value="과학">과학</option>
        </select>

        <select value={input.subject} onChange={(e) => setInput({ ...input, subject: e.target.value })}>
          {currentSubjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="등급 입력"
          value={input.score}
          onChange={(e) => setInput({ ...input, score: Number(e.target.value) })}
        />

        <button onClick={handleSave}>{editingId ? "수정 저장" : "저장"}</button>
      </div>

      <div style={{ marginBottom: 16, fontWeight: 800 }}>내신 평균: {overallAverage || "-"}</div>

      <div style={{ display: "grid", gap: 12 }}>
        {records.map((r) => (
          <div key={r.id} style={{ padding: 14, borderRadius: 14, border: "1px solid #dbe2ea", background: "#fff" }}>
            <div>
              {r.year}학년 {r.semester}학기 / {r.examType}
            </div>
            <div>
              {r.area} · {r.subject} · {r.score}등급
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(r)}>수정</button>
              <button onClick={() => handleDelete(r.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}