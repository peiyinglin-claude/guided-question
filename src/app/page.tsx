"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import MessageThread from "@/components/MessageThread";
import InteractiveDialog from "@/components/InteractiveDialog";
import { FlowStep, Message, ResponseData, FLOW_CONFIG } from "@/lib/flowData";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("baseline");
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleMessageCount, setVisibleMessageCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMessagesShown, setAllMessagesShown] = useState(false);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (rightColumnRef.current) {
      requestAnimationFrame(() => {
        if (rightColumnRef.current) {
          rightColumnRef.current.scrollTo({
            top: rightColumnRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, []);

  // Initialize messages when step changes
  useEffect(() => {
    const config = FLOW_CONFIG[currentStep];
    if (config) {
      if (currentStep === "ai-opening" || currentStep === "guided-q-2nd") {
        // Append new messages to existing thread
        setMessages((prev) => [...prev, ...config.messages]);
        // Don't reset visible count - add new messages on top
        setVisibleMessageCount((prev) => prev);
      } else if (currentStep === "ai-summary") {
        setMessages((prev) => [...prev, ...config.messages]);
        setVisibleMessageCount((prev) => prev);
      } else {
        setMessages(config.messages);
        setVisibleMessageCount(0);
      }
      setShowDialog(false);
      setAllMessagesShown(false);
    }
  }, [currentStep]);

  // Animate messages appearing one by one
  useEffect(() => {
    if (visibleMessageCount < messages.length) {
      const timer = setTimeout(
        () => {
          setVisibleMessageCount((prev) => prev + 1);
          scrollToBottom();
        },
        visibleMessageCount === 0 ? 300 : 800
      );
      return () => clearTimeout(timer);
    } else if (messages.length > 0 && visibleMessageCount === messages.length) {
      setAllMessagesShown(true);
      const config = FLOW_CONFIG[currentStep];
      if (config?.hasDialog && config.questions) {
        const timer = setTimeout(() => {
          setShowDialog(true);
          setTimeout(scrollToBottom, 150);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [visibleMessageCount, messages.length, currentStep, scrollToBottom]);

  const handleBaselineReady = () => {
    // Add the "我準備好了！" as a user action indicator
    const readyMsg: Message = {
      id: "user-ready",
      type: "response",
      data: { questionTitle: "", selectedLabels: ["我準備好了！"] },
    };
    setMessages((prev) => [...prev, readyMsg]);
    setVisibleMessageCount((prev) => prev + 1);
    setAllMessagesShown(false);
    setIsLoading(true);

    setTimeout(() => {
      scrollToBottom();
    }, 100);

    // Simulate loading, then move to AI opening
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("ai-opening");
    }, 2000);
  };

  const handleQuestionSubmit = (response: ResponseData) => {
    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Add response message
    const responseMsg: Message = {
      id: `response-${Date.now()}`,
      type: "response",
      data: response,
    };

    setMessages((prev) => [...prev, responseMsg]);
    setVisibleMessageCount((prev) => prev + 1);
    setShowDialog(false);

    setTimeout(scrollToBottom, 100);

    const config = FLOW_CONFIG[currentStep];
    const questions = config?.questions || [];

    if (currentQuestionIndex < questions.length - 1) {
      // Next question in same round
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowDialog(true);
        setTimeout(scrollToBottom, 150);
      }, 600);
    } else {
      // All questions done - loading then summary
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (currentStep === "ai-opening") {
          setCurrentStep("ai-summary");
          setCurrentQuestionIndex(0);
        } else if (currentStep === "guided-q-2nd") {
          setCurrentStep("ai-summary-2nd");
          setCurrentQuestionIndex(0);
        }
      }, 2500);
    }
  };

  const handleSummaryDone = () => {
    setCurrentStep("guided-q-2nd");
    setCurrentQuestionIndex(0);
    setResponses([]);
  };

  const getStepperState = () => {
    switch (currentStep) {
      case "baseline":
      case "loading":
        return { completed: [0, 1], current: 1 };
      case "ai-opening":
      case "guided-q-1st":
      case "ai-summary":
      case "guided-q-2nd":
      case "ai-summary-2nd":
        return { completed: [0, 1], current: 2 };
      default:
        return { completed: [0], current: 1 };
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar stepperState={getStepperState()} />
        <div
          ref={rightColumnRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col"
        >
          {/* Messages area */}
          <div className="flex-1 px-8 pt-6 pb-4 max-w-[960px] mx-auto w-full">
            <MessageThread
              messages={messages}
              visibleCount={visibleMessageCount}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
          </div>

          {/* Sticky bottom area for dialog / buttons / loading */}
          {currentStep === "baseline" && allMessagesShown && !isLoading && (
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t px-8 py-4" style={{ borderColor: "var(--border-color)" }}>
              <div className="max-w-[960px] mx-auto flex justify-end">
                <button
                  onClick={handleBaselineReady}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-colors hover:brightness-110"
                  style={{ background: "var(--green-primary)" }}
                >
                  我準備好了！
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {showDialog && FLOW_CONFIG[currentStep]?.questions && (
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t px-8 py-4" style={{ borderColor: "var(--border-color)" }}>
              <div className="max-w-[960px] mx-auto">
                <InteractiveDialog
                  key={`${currentStep}-${currentQuestionIndex}`}
                  question={
                    FLOW_CONFIG[currentStep]!.questions![currentQuestionIndex]
                  }
                  questionIndex={currentQuestionIndex}
                  totalQuestions={
                    FLOW_CONFIG[currentStep]!.questions!.length
                  }
                  onSubmit={handleQuestionSubmit}
                />
              </div>
            </div>
          )}

          {currentStep === "ai-summary" && allMessagesShown && !isLoading && (
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t px-8 py-4" style={{ borderColor: "var(--border-color)" }}>
              <div className="max-w-[960px] mx-auto flex justify-end">
                <button
                  onClick={handleSummaryDone}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-colors hover:brightness-110"
                  style={{ background: "var(--green-primary)" }}
                >
                  繼續下一輪
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm px-8 py-4">
              <div className="max-w-[960px] mx-auto">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--green-primary)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 2l4 4-4 4-4-4z" fill="white" fillOpacity="0.9" />
                      <path d="M4 10L8 6l4 4-4 4-4-4z" fill="white" fillOpacity="0.6" />
                    </svg>
                  </div>
                  <div
                    className="flex items-center gap-0.5 text-sm py-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <span>
                      {currentStep === "baseline"
                        ? "正在分析你更新的內容"
                        : "正在分析你的回答"}
                    </span>
                    <span className="flex">
                      <span className="loading-dot">.</span>
                      <span className="loading-dot">.</span>
                      <span className="loading-dot">.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div
      className="h-10 px-6 flex items-center border-t shrink-0"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "var(--green-primary)" }}
      >
        <span>✦</span>
        <span className="font-medium">Powered by CakeAI</span>
      </div>
    </div>
  );
}
