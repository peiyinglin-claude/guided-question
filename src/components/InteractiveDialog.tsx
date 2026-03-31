"use client";

import { useState } from "react";
import { Question, ResponseData } from "@/lib/flowData";

interface Props {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onSubmit: (response: ResponseData) => void;
}

export default function InteractiveDialog({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState("1,000,000");
  const [salaryMax, setSalaryMax] = useState("15,000,000");
  const [freeText, setFreeText] = useState("");
  const [showFreeText, setShowFreeText] = useState(false);

  const handleToggle = (label: string) => {
    if (question.type === "radio") {
      setSelected([label]);
      setShowFreeText(false);
    } else {
      // Checkbox
      if (selected.includes(label)) {
        setSelected(selected.filter((s) => s !== label));
      } else if (!question.maxSelect || selected.length < question.maxSelect) {
        setSelected([...selected, label]);
      }
      setShowFreeText(false);
    }
  };

  const handleFreeTextSelect = () => {
    setSelected([]);
    setShowFreeText(true);
  };

  const handleSubmit = () => {
    if (question.type === "salary") {
      onSubmit({
        questionTitle: question.title,
        selectedLabels: [`${salaryMin}~${salaryMax} TWD`],
      });
    } else if (showFreeText && freeText.trim()) {
      onSubmit({
        questionTitle: question.title,
        selectedLabels: [freeText.trim()],
      });
    } else if (selected.length > 0) {
      onSubmit({
        questionTitle: question.title,
        selectedLabels: selected,
      });
    }
  };

  const canSubmit =
    question.type === "salary" ||
    selected.length > 0 ||
    (showFreeText && freeText.trim().length > 0);

  return (
    <div className="rounded-xl border animate-fadeInUp" style={{ borderColor: "var(--border-color)" }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-base flex-1 pr-4" style={{ color: "var(--text-primary)" }}>
            {question.title}
          </h3>
          <span className="text-sm shrink-0" style={{ color: "var(--text-tertiary)" }}>
            {questionIndex + 1} of {totalQuestions}
          </span>
        </div>
        {question.subtitle && (
          <p className="text-sm leading-6 mt-1" style={{ color: "var(--text-secondary)" }}>
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Options */}
      {question.type !== "salary" && (
        <div className="px-6 pb-2">
          <div className="flex flex-col">
            {question.options?.map((opt) => (
              <label
                key={opt.label}
                className="flex items-start gap-3 py-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                style={{ borderColor: "var(--border-color)" }}
              >
                <input
                  type={question.type === "checkbox" ? "checkbox" : "radio"}
                  name={question.id}
                  checked={selected.includes(opt.label)}
                  onChange={() => handleToggle(opt.label)}
                  className={question.type === "checkbox" ? "custom-checkbox mt-0.5" : "custom-radio mt-0.5"}
                />
                <div className="flex-1">
                  <span className="text-sm leading-6" style={{ color: "var(--text-primary)" }}>
                    {opt.label}
                  </span>
                  {opt.description && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {opt.description}
                    </p>
                  )}
                </div>
              </label>
            ))}

            {/* Free text option */}
            <label
              className="flex items-start gap-3 py-3 cursor-pointer -mx-2 px-2 rounded transition-colors hover:bg-gray-50"
            >
              <input
                type="radio"
                name={`${question.id}-free`}
                checked={showFreeText}
                onChange={handleFreeTextSelect}
                className="custom-radio mt-0.5"
              />
              <span className="text-sm leading-6" style={{ color: "var(--text-tertiary)" }}>
                都不是，讓我說明一下...
              </span>
            </label>

            {showFreeText && (
              <div className="ml-8 mb-2">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="請輸入你的想法..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--green-primary)]"
                  style={{ borderColor: "var(--border-color)" }}
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Salary input */}
      {question.type === "salary" && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--green-primary)]"
              style={{ borderColor: "var(--border-color)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>-</span>
            <input
              type="text"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--green-primary)]"
              style={{ borderColor: "var(--border-color)" }}
            />
            <div
              className="flex items-center gap-1 border rounded-lg px-3 py-3 text-sm"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            >
              TWD
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Submit button */}
      <div className="px-6 pb-5 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canSubmit ? "var(--green-primary)" : "var(--green-grey-10)",
          }}
        >
          Next
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
