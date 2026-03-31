import { Message, CAREER_SUMMARY } from "@/lib/flowData";
import { RefObject } from "react";

interface Props {
  messages: Message[];
  visibleCount: number;
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function MessageThread({ messages, visibleCount, messagesEndRef }: Props) {
  const visibleMessages = messages.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-4">
      {visibleMessages.map((msg, idx) => (
        <div
          key={msg.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          {msg.type === "ai" && <AiMessage text={msg.text!} />}
          {msg.type === "card" && <CareerSummaryCard />}
          {msg.type === "response" && msg.data && <ResponseMessage data={msg.data} />}
          {msg.type === "summary" && <SummaryMessage highlightText={msg.highlightText!} />}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function AiAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ background: "var(--green-primary)" }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 2l4 4-4 4-4-4z" fill="white" fillOpacity="0.9" />
        <path d="M4 10L8 6l4 4-4 4-4-4z" fill="white" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

function AiMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <AiAvatar />
      <div className="flex-1 pt-1">
        {text.split("\n").map((line, i) => (
          <p key={i} className="text-sm leading-6" style={{ color: "var(--text-primary)" }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SummaryMessage({ highlightText }: { highlightText: string }) {
  return (
    <div className="flex items-start gap-3">
      <AiAvatar />
      <div className="flex-1 pt-1">
        <div className="green-highlight">
          <p className="text-sm leading-6 font-medium" style={{ color: "var(--green-dark)" }}>
            {highlightText}
          </p>
        </div>
      </div>
    </div>
  );
}

function CareerSummaryCard() {
  return (
    <div className="ml-11 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">📋</span>
          <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            你的現況摘要
          </h3>
        </div>

        {/* Info rows */}
        <div className="flex flex-col">
          {CAREER_SUMMARY.rows.map((row, i) => (
            <div
              key={i}
              className="flex items-start py-3 border-b last:border-b-0"
              style={{ borderColor: "var(--border-color)" }}
            >
              <span
                className="w-[100px] shrink-0 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {row.label}
              </span>
              <span className="flex-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {row.value}
              </span>
              <button className="ml-2 shrink-0 opacity-40 hover:opacity-70 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="flex items-start py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
          <span
            className="w-[100px] shrink-0 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            技能
          </span>
          <div className="flex-1 flex flex-wrap gap-1.5">
            {CAREER_SUMMARY.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-xs font-medium border"
                style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              >
                {skill}
              </span>
            ))}
          </div>
          <button className="ml-2 shrink-0 opacity-40 hover:opacity-70 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Highlights section */}
      <div className="px-6 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm" style={{ color: "var(--green-primary)" }}>
            主要職責與成就亮點
          </h4>
          <button className="opacity-40 hover:opacity-70 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {CAREER_SUMMARY.highlights.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm mt-0.5">🏅</span>
              <p className="text-sm leading-6" style={{ color: "var(--text-primary)" }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResponseMessage({ data }: { data: { questionTitle: string; selectedLabels: string[] } }) {
  // Simple text-only response (like "我準備好了！")
  if (!data.questionTitle) {
    return (
      <div className="flex justify-end">
        <div
          className="rounded-lg px-4 py-2.5 text-sm font-medium"
          style={{ background: "var(--green-grey-5)", color: "var(--text-primary)" }}
        >
          {data.selectedLabels[0]}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div
        className="max-w-[480px] rounded-lg px-4 py-3"
        style={{ background: "var(--green-grey-5)" }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <p className="flex-1 text-sm font-semibold leading-6 truncate" style={{ color: "var(--text-primary)" }}>
            {data.questionTitle}
          </p>
          <button className="shrink-0 opacity-40 hover:opacity-70 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {data.selectedLabels.map((label) => (
            <span
              key={label}
              className="bg-white rounded px-2 py-0.5 text-xs leading-[18px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
