export type FlowStep =
  | "baseline"
  | "loading"
  | "ai-opening"
  | "guided-q-1st"
  | "ai-summary"
  | "guided-q-2nd"
  | "ai-summary-2nd";

export type MessageType = "ai" | "card" | "response" | "summary";

export interface Message {
  id: string;
  type: MessageType;
  text?: string;
  data?: ResponseData;
  summaryText?: string;
  highlightText?: string;
}

export interface QuestionOption {
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: "checkbox" | "radio" | "salary";
  maxSelect?: number;
  options?: QuestionOption[];
}

export interface ResponseData {
  questionTitle: string;
  selectedLabels: string[];
}

interface FlowStepConfig {
  messages: Message[];
  hasDialog?: boolean;
  questions?: Question[];
}

export const CAREER_SUMMARY = {
  rows: [
    { label: "現職", value: "Senior Product Designer（2021–2025，剛結束）" },
    { label: "總年資", value: "總年資：約 7.5 年（含實習）" },
    {
      label: "主要雇主",
      value: "Arc & Codementor（待了將近 7 年，從 on-site 到 remote）",
    },
    {
      label: "產業",
      value: "HR Tech（AI 人才媒合）+ EdTech（開發者學習平台）",
    },
    { label: "工作模式", value: "近 4 年全遠端" },
    { label: "學歷", value: "台科大工業設計碩士" },
  ],
  skills: [
    "UI/UX Design",
    "Design Systems",
    "User Research",
    "Prototyping",
    "Figma",
    "A/B Testing",
  ],
  highlights: [
    "主導 AI 驅動的自動化媒合流程，OKR 達成率 200%",
    "負責多個 0-to-1 產品（Codementor Events、DevProjects、Arc 3.0）",
    "有 Design System 遷移與維護的實際經驗",
    "有做 user research、usability testing、A/B testing",
    "曾以最佳實習生獲 Yahoo 肯定",
  ],
};

const Q1_1ST: Question = {
  id: "q1-1st",
  title: "這次換工作，你最核心的期待是什麼？（多選，最多 3 項）",
  subtitle:
    "在 Arc 待了這麼久，你從 on-site 一路做到 Senior，我很好奇這次出來找的是什麼——",
  type: "checkbox",
  maxSelect: 3,
  options: [
    { label: "深化設計專業（成為更強的 IC）" },
    { label: "走向管理 / 帶人" },
    { label: "獲得更大的產品主導權" },
    { label: "進更知名 / 更大的公司" },
    { label: "探索新的產業或市場" },
    { label: "找回工作與生活的平衡" },
  ],
};

const Q2_1ST: Question = {
  id: "q2-1st",
  title: "你覺得自己目前在職涯的哪個階段？",
  subtitle:
    "從你的履歷來看，你有 7.5 年的經驗，在 Arc 也帶過 junior member，但一直是 IC 角色。我的感覺是你大約在中高階的位置，但想聽聽你自己的判斷——",
  type: "radio",
  options: [
    { label: "還在累積基礎，很多東西要學" },
    { label: "能獨立負責完整的專案，但還沒到帶方向的程度" },
    { label: "可以帶方向、影響團隊決策，但還沒有正式的領導角色" },
    { label: "已經在帶團隊或定義部門策略" },
  ],
};

const Q3_1ST: Question = {
  id: "q3-1st",
  title: "你在 Arc 做 Design System 的遷移和維護時，最享受的是哪個部分？",
  subtitle:
    "我注意到這是你履歷裡一個蠻核心的經歷，想了解你在這個過程中最有動力的事——",
  type: "radio",
  options: [
    {
      label: "研究不同設計師、不同情境的需求，找出大家真正要的共通模式",
      description: "享受「原來大家真正需要的是這個」的瞬間",
    },
    {
      label: "把原本混亂的東西整理成一套清楚、有邏輯的系統",
      description: "享受從 0 到有系統的過程",
    },
    {
      label: "跟工程師來回討論，找到設計跟技術之間的最佳平衡點",
      description: "享受跨角色合作把事情做出來",
    },
    {
      label: "看到其他人用你建的系統順利完成工作，覺得有成就感",
      description: "享受自己的產出被廣泛使用",
    },
  ],
};

const Q4_1ST: Question = {
  id: "q4-1st",
  title: "目前期待的年薪範圍（TWD）？",
  type: "salary",
};

const Q1_2ND: Question = {
  id: "q1-2nd",
  title: "你提到想探索新的產業，有沒有特別感興趣的方向？（多選，最多選三個）",
  subtitle:
    "你過去 7 年都在 HR Tech / EdTech，對英語市場很熟悉。好奇你心裡有沒有「一直想試試看但還沒機會」的領域——",
  type: "checkbox",
  maxSelect: 3,
  options: [
    { label: "FinTech / 金融科技" },
    { label: "HealthTech / 醫療健康" },
    { label: "E-commerce / 零售" },
    { label: "SaaS / 企業工具（B2B）" },
    { label: "沒有特定方向，但想離開 HR Tech / EdTech" },
  ],
};

export const FLOW_CONFIG: Record<string, FlowStepConfig> = {
  baseline: {
    messages: [
      {
        id: "baseline-1",
        type: "ai",
        text: "嗨 Peiying，我讀完你的履歷了。\n以下是我整理出來的資訊，如果有任何不準確的地方，告訴我：",
      },
      { id: "baseline-2", type: "card" },
      {
        id: "baseline-3",
        type: "ai",
        text: "以上是我從你的履歷裡頭讀到的事實。接下來我想問你幾個問題——因為有些事光看履歷猜不準，例如你這次出來找的是什麼、對公司規模有沒有偏好、薪資的期待在哪裡。每輪 3~5 題，不會太長，你準備好了嗎？",
      },
    ],
    hasDialog: false,
  },
  loading: {
    messages: [],
    hasDialog: false,
  },
  "ai-opening": {
    messages: [
      {
        id: "opening-1",
        type: "ai",
        text: "謝謝你更新裡面的資訊，我已經記下來了！",
      },
      {
        id: "opening-2",
        type: "ai",
        text: "接著我想問你幾個問題，來補齊我還不確定的部分，幫我更清楚你這次求職最在意的是什麼",
      },
    ],
    hasDialog: true,
    questions: [Q1_1ST, Q2_1ST, Q3_1ST, Q4_1ST],
  },
  "guided-q-1st": {
    messages: [],
    hasDialog: true,
    questions: [Q1_1ST, Q2_1ST, Q3_1ST, Q4_1ST],
  },
  "ai-summary": {
    messages: [
      {
        id: "summary-1",
        type: "ai",
        text: "好的，第一輪問答結束！讓我快速整理一下目前了解到的：",
      },
      {
        id: "summary-2",
        type: "summary",
        highlightText:
          "你想深化 IC 專業、探索新產業、重視生活平衡。你對自己的定位是中階，享受系統化整理和跨角色協作。工作模式偏好 remote-first。",
      },
      {
        id: "summary-3",
        type: "ai",
        text: "接著我想問你幾個問題，來補齊我還不確定的部分，幫我更清楚你這次求職最在意的是什麼",
      },
    ],
    hasDialog: false,
  },
  "guided-q-2nd": {
    messages: [
      {
        id: "2nd-opening-1",
        type: "ai",
        text: "接著我想問你幾個問題，來補齊我還不確定的部分，幫我更清楚你這次求職最在意的是什麼",
      },
    ],
    hasDialog: true,
    questions: [Q1_2ND],
  },
  "ai-summary-2nd": {
    messages: [
      {
        id: "summary-2nd-1",
        type: "ai",
        text: "太好了！我現在對你的職涯方向有了更清楚的了解。讓我根據這些資訊為你建立職涯地圖...",
      },
    ],
    hasDialog: false,
  },
};
