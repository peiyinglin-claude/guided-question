interface StepperState {
  completed: number[];
  current: number;
}

const STEPS = [
  "上傳你的履歷",
  "你的現況摘要",
  "聊聊你的期待",
  "選擇你的路徑",
  "查看完整職涯路徑及策略",
];

export default function LeftSidebar({ stepperState }: { stepperState: StepperState }) {
  return (
    <aside className="w-[320px] border-r shrink-0 flex flex-col" style={{ borderColor: "var(--border-color)" }}>
      <div className="p-5 flex-1">
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          AI Career Map 進度
        </h2>

        <div className="flex flex-col">
          {STEPS.map((step, i) => {
            const isCompleted = stepperState.completed.includes(i);
            const isCurrent = stepperState.current === i;
            const isFuture = !isCompleted && !isCurrent;

            return (
              <div key={i} className="flex items-start gap-3">
                {/* Stepper indicator + line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      background: isCompleted
                        ? "var(--green-primary)"
                        : isCurrent
                        ? "var(--green-primary)"
                        : "var(--green-grey-10)",
                      color: isCompleted || isCurrent ? "white" : "var(--text-tertiary)",
                    }}
                  >
                    {isCompleted ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-px h-4"
                      style={{
                        background: isCompleted ? "var(--green-primary)" : "var(--green-grey-10)",
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-sm leading-6"
                  style={{
                    color: isFuture ? "var(--text-tertiary)" : "var(--text-primary)",
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Source</p>
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            Peiying-Resume-202507.pdf
          </div>
        </div>
      </div>
    </aside>
  );
}
