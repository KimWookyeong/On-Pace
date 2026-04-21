import { useEffect, useMemo, useState } from "react";
import {
  GOAL_KEY,
  GoalForm,
  MAJOR_LIST,
  UNIVERSITY_LIST,
  calcMatchingRates,
  getRecommendationsByMajor,
  getTopStrategies,
  loadGoal,
  saveGoal,
} from "../utils/onpaceStorage";

const initialGoal: GoalForm = {
  university: "",
  major: "",
  track: "",
  gpa: null,
  mockExam: null,
  activitiesScore: null,
  majorFitScore: null,
  essayScore: null,
  practicalScore: null,
};

export default function GoalPage() {
  const [form, setForm] = useState<GoalForm>(initialGoal);
  const [savedGoal, setSavedGoal] = useState<GoalForm | null>(null);
  const [uniQuery, setUniQuery] = useState("");
  const [majorQuery, setMajorQuery] = useState("");

  useEffect(() => {
    const goal = loadGoal();
    if (goal) {
      setSavedGoal(goal);
      setForm(goal);
      setUniQuery(goal.university);
      setMajorQuery(goal.major);
    }
  }, []);

  const filteredUniversities = UNIVERSITY_LIST.filter((u) =>
    u.toLowerCase().includes(uniQuery.toLowerCase())
  ).slice(0, 8);

  const filteredMajors = MAJOR_LIST.filter((m) =>
    m.toLowerCase().includes(majorQuery.toLowerCase())
  ).slice(0, 8);

  const rates = useMemo(() => {
    if (!savedGoal) return null;
    return calcMatchingRates(savedGoal);
  }, [savedGoal]);

  const sortedRates = useMemo(() => {
    if (!rates) return [];
    return getTopStrategies(rates);
  }, [rates]);

  const recommendations = useMemo(() => {
    if (!savedGoal?.major) return null;
    return getRecommendationsByMajor(savedGoal.major);
  }, [savedGoal]);

  const handleSave = () => {
    const track =
      form.major.includes("공학") || form.major.includes("소프트웨어") || form.major.includes("인공지능")
        ? "공학"
        : form.major.includes("의") || form.major.includes("간호") || form.major.includes("약")
        ? "의료보건"
        : form.major.includes("디자인") || form.major.includes("음악") || form.major.includes("체육")
        ? "예체능"
        : "인문사회";

    const next = { ...form, track };
    saveGoal(next);
    setSavedGoal(next);
    alert("목표가 저장되었습니다.");
  };

  const showRates =
    !!savedGoal &&
    savedGoal.gpa != null &&
    savedGoal.mockExam != null &&
    savedGoal.activitiesScore != null &&
    savedGoal.majorFitScore != null;

  return (
    <div>
      <h3>🎯 목표 설정</h3>

      <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
        <div>
          <input
            value={uniQuery}
            placeholder="대학 검색"
            onChange={(e) => {
              setUniQuery(e.target.value);
              setForm({ ...form, university: e.target.value });
            }}
          />
          {uniQuery && (
            <div style={{ marginTop: 8, background: "#fff", border: "1px solid #dbe2ea", borderRadius: 12, padding: 8 }}>
              {filteredUniversities.map((u) => (
                <div
                  key={u}
                  style={{ padding: 8, cursor: "pointer" }}
                  onClick={() => {
                    setUniQuery(u);
                    setForm({ ...form, university: u });
                  }}
                >
                  {u}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <input
            value={majorQuery}
            placeholder="학과 검색"
            onChange={(e) => {
              setMajorQuery(e.target.value);
              setForm({ ...form, major: e.target.value });
            }}
          />
          {majorQuery && (
            <div style={{ marginTop: 8, background: "#fff", border: "1px solid #dbe2ea", borderRadius: 12, padding: 8 }}>
              {filteredMajors.map((m) => (
                <div
                  key={m}
                  style={{ padding: 8, cursor: "pointer" }}
                  onClick={() => {
                    setMajorQuery(m);
                    setForm({ ...form, major: m });
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="number"
          placeholder="내신 평균 등급"
          value={form.gpa ?? ""}
          onChange={(e) => setForm({ ...form, gpa: e.target.value ? Number(e.target.value) : null })}
        />
        <input
          type="number"
          placeholder="모의고사 평균 등급"
          value={form.mockExam ?? ""}
          onChange={(e) => setForm({ ...form, mockExam: e.target.value ? Number(e.target.value) : null })}
        />
        <input
          type="number"
          placeholder="비교과 점수 (0~100)"
          value={form.activitiesScore ?? ""}
          onChange={(e) => setForm({ ...form, activitiesScore: e.target.value ? Number(e.target.value) : null })}
        />
        <input
          type="number"
          placeholder="전공 적합도 (0~100)"
          value={form.majorFitScore ?? ""}
          onChange={(e) => setForm({ ...form, majorFitScore: e.target.value ? Number(e.target.value) : null })}
        />
        <input
          type="number"
          placeholder="논술 예상 점수 (선택)"
          value={form.essayScore ?? ""}
          onChange={(e) => setForm({ ...form, essayScore: e.target.value ? Number(e.target.value) : null })}
        />
        <input
          type="number"
          placeholder="실기 점수 (선택)"
          value={form.practicalScore ?? ""}
          onChange={(e) => setForm({ ...form, practicalScore: e.target.value ? Number(e.target.value) : null })}
        />

        <button onClick={handleSave}>저장</button>
      </div>

      {savedGoal && (
        <div style={{ marginBottom: 18, padding: 16, borderRadius: 16, background: "#f8fbff", border: "1px solid #dde7f5" }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            저장된 목표: {savedGoal.university} / {savedGoal.major}
          </div>
          <div style={{ marginTop: 6, color: "#475569" }}>희망 계열: {savedGoal.track}</div>
        </div>
      )}

      {!showRates && savedGoal && (
        <div style={{ padding: 16, borderRadius: 16, background: "#fff7ed", border: "1px solid #fed7aa", marginBottom: 18 }}>
          대학/학과만 저장한 상태입니다.  
          매칭률을 보려면 내신, 모의고사, 비교과, 전공 적합도를 함께 입력해 주세요.
        </div>
      )}

      {showRates && rates && (
        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <h3>📊 매칭률</h3>
            {sortedRates.map(([type, score], i) => (
              <div key={type} style={{ marginBottom: 8 }}>
                {i + 1}순위: {type} ({score}%)
              </div>
            ))}
          </div>

          {recommendations && (
            <>
              <div>
                <h3>📘 중요 교과</h3>
                <ul>
                  {recommendations.importantSubjects.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>📗 추천 활동</h3>
                <ul>
                  {recommendations.activities.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>📚 추천 독서</h3>
                <ul>
                  {recommendations.books.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>🧪 추천 프로젝트</h3>
                <ul>
                  {recommendations.projects.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}