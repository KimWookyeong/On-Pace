import { useEffect, useState } from "react";
import {
  ChatMessage,
  calcMatchingRates,
  getTopStrategies,
  loadChat,
  loadGoal,
  makeId,
  saveChat,
} from "../utils/onpaceStorage";

export default function AIConsultPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = loadChat();
    setMessages(saved);
  }, []);

  const createReply = (userText: string) => {
    const goal = loadGoal();

    if (!goal) {
      return "먼저 목표 탭에서 대학과 학과를 저장해 주세요.";
    }

    const rates = calcMatchingRates(goal);
    const top = rates ? getTopStrategies(rates)[0] : null;

    if (userText.includes("매칭") || userText.includes("전형")) {
      if (!rates || !top) {
        return "내신, 모의고사, 비교과, 전공 적합도를 입력하면 전형별 매칭률을 분석해드릴게요.";
      }
      return `현재 1순위 추천 전형은 ${top[0]} (${top[1]}%)입니다. 목표 학과는 ${goal.major}입니다.`;
    }

    if (userText.includes("동아리")) {
      return `${goal.major} 진학을 위해서는 전공 관련 탐구 동아리, 독서 토론 동아리, 프로젝트형 활동이 유리합니다.`;
    }

    if (userText.includes("독서")) {
      return `${goal.major} 관련 입문서, 전공 기초 개념서, 시사·탐구 도서를 함께 읽는 것이 좋습니다.`;
    }

    if (userText.includes("프로젝트")) {
      return `${goal.major}와 연결되는 문제 해결형 프로젝트를 추천합니다. 결과물, 보고서, 발표까지 남기면 더 좋습니다.`;
    }

    return `${goal.major} 진학을 기준으로 보면 전공 관련 활동, 독서, 프로젝트를 꾸준히 연결하는 전략이 가장 중요합니다.`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      text: input,
      createdAt: new Date().toISOString(),
    };

    const assistantMessage: ChatMessage = {
      id: makeId(),
      role: "assistant",
      text: createReply(input),
      createdAt: new Date().toISOString(),
    };

    const next = [...messages, userMessage, assistantMessage];
    setMessages(next);
    saveChat(next);
    setInput("");
  };

  return (
    <div>
      <h3>🤖 AI 상담</h3>

      <div
        style={{
          minHeight: 300,
          border: "1px solid #dbe2ea",
          borderRadius: 16,
          padding: 16,
          background: "#fff",
          marginBottom: 14,
          display: "grid",
          gap: 10,
        }}
      >
        {messages.length === 0 && <div style={{ color: "#64748b" }}>상담 내용을 입력해보세요. 예: 내 전형 매칭률 알려줘</div>}

        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === "user" ? "end" : "start",
              maxWidth: "80%",
              padding: "10px 12px",
              borderRadius: 14,
              background: m.role === "user" ? "#dbeafe" : "#f1f5f9",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="상담 내용을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}