import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    nav: {
      home: "Home",
      assessment: "Assessment",
      result: "Result",
    },
    brand: {
      language: "language",
      current: "English",
      other: "Chinese",
    },
    home: {
      title: "Build a decision score from past, present and future signals.",
      start: "Start Assessment",
      latest: "View Latest Result",
    },
    assessment: {
      eyebrow: "Assessment",
      title: "Configure your decision profile",
      description: "Please fill in the index based on your true inner thoughts.",
      scaleType: "Scoring System",
      hundredScale: "Hundred-point Scale",
      tenScale: "Ten-point Scale",
      personalityType: "Personality Type",
      pastScore: "Past Score",
      presentScore: "Present Score",
      futureScore: "Future Score",
      submitting: "Submitting...",
      submit: "Submit Assessment",
      guide: "Guide",
      past: "Past",
      pastDescription:
        "Did I seriously plan to do this before?",
      present: "Present",
      presentDescription:
        "How strong is my desire to do this right now?",
      future: "Future",
      futureDescription:
        "In the long run, will I be grateful that I did this now?",
      rangeHint: "0 - 100",
    },
    result: {
      eyebrow: "Result",
      emptyTitle: "No assessment result yet",
      emptyDescription:
        "Submit an assessment first, then the result will be shown here.",
      goAssessment: "Go to Assessment",
      title: "Latest decision",
      nextStep: "Next Step",
      nextDescription:
        "Adjust the input scores or switch personality type if you want to compare different weighting strategies.",
      rerun: "Run Another Assessment",
      backHome: "Back Home",
      score: "Score",
      decision: "Decision",
      message: "Message",
      detailedGuide: "\u8be6\u7ec6\u8bf4\u660e",
      guidePastDescription:
        "Measure previous outcomes, history, and accumulated evidence.",
      guidePresentDescription:
        "Measure current conditions, constraints, and available resources.",
      guideFutureDescription:
        "Measure long-term returns, potential value, and execution space.",
    },
  },
  zh: {
    nav: {
      home: "\u9996\u9875",
      assessment: "\u8bc4\u4f30",
      result: "\u7ed3\u679c",
    },
    brand: {
      language: "\u8bed\u8a00",
      current: "\u4e2d\u6587",
      other: "\u82f1\u6587",
    },
    home: {
      title:
        "\u4ece\u8fc7\u53bb\u3001\u73b0\u5728\u4e0e\u672a\u6765\u4e09\u4e2a\u7ef4\u5ea6\uff0c\u751f\u6210\u4f60\u7684\u51b3\u7b56\u5206\u6570\u3002",
      start: "\u5f00\u59cb\u8bc4\u4f30",
      latest: "\u67e5\u770b\u6700\u65b0\u7ed3\u679c",
    },
    assessment: {
      eyebrow: "\u8bc4\u4f30",
      title: "\u914d\u7f6e\u4f60\u7684\u51b3\u7b56\u753b\u50cf",
      description:
        "\u8bf7\u57fa\u4e8e\u4f60\u771f\u5b9e\u7684\u5185\u5fc3\u60f3\u6cd5\u586b\u5199\u4ee5\u4e0b\u6307\u6807\u3002",
      scaleType: "\u8bc4\u5206\u7cfb\u7edf",
      hundredScale: "\u767e\u5206\u5236",
      tenScale: "\u5341\u5206\u5236",
      personalityType: "\u4eba\u683c\u7c7b\u578b",
      pastScore: "\u8fc7\u53bb\u5206\u6570",
      presentScore: "\u73b0\u5728\u5206\u6570",
      futureScore: "\u672a\u6765\u5206\u6570",
      submitting: "\u63d0\u4ea4\u4e2d...",
      submit: "\u63d0\u4ea4\u8bc4\u4f30",
      guide: "\u8bf4\u660e",
      past: "\u8fc7\u53bb",
      pastDescription:
        "\u6211\u4e4b\u524d\u662f\u5426\u8ba4\u771f\u6253\u7b97\u8fc7\u505a\u8fd9\u4ef6\u4e8b",
      present: "\u73b0\u5728",
      presentDescription:
        "\u6b64\u523b\u6211\u60f3\u505a\u8fd9\u4ef6\u4e8b\u7684\u610f\u613f\u6709\u591a\u5f3a\u70c8",
      future: "\u672a\u6765",
      futureDescription:
        "\u957f\u671f\u6765\u770b\u6211\u4f1a\u4e0d\u4f1a\u611f\u8c22\u81ea\u5df1\u73b0\u5728\u505a\u4e86\u8fd9\u4ef6\u4e8b",
      rangeHint: "0 - 100",
    },
    result: {
      eyebrow: "\u7ed3\u679c",
      emptyTitle: "\u8fd8\u6ca1\u6709\u8bc4\u4f30\u7ed3\u679c",
      emptyDescription:
        "\u8bf7\u5148\u5b8c\u6210\u4e00\u6b21\u8bc4\u4f30\uff0c\u968f\u540e\u8fd9\u91cc\u4f1a\u663e\u793a\u7ed3\u679c\u3002",
      goAssessment: "\u524d\u5f80\u8bc4\u4f30",
      title: "\u6700\u65b0\u51b3\u7b56",
      nextStep: "\u4e0b\u4e00\u6b65",
      nextDescription:
        "\u5982\u679c\u4f60\u60f3\u6bd4\u8f83\u4e0d\u540c\u6743\u91cd\u7b56\u7565\uff0c\u53ef\u4ee5\u91cd\u65b0\u8c03\u6574\u5206\u6570\u6216\u5207\u6362\u4eba\u683c\u7c7b\u578b\u3002",
      rerun: "\u518d\u6b21\u8bc4\u4f30",
      backHome: "\u8fd4\u56de\u9996\u9875",
      score: "\u5206\u6570",
      decision: "\u51b3\u7b56",
      message: "\u8bf4\u660e",
      detailedGuide: "\u8be6\u7ec6\u8bf4\u660e",
      guidePastDescription:
        "\u8861\u91cf\u8fc7\u5f80\u7ed3\u679c\u3001\u5386\u53f2\u7ecf\u9a8c\u4e0e\u5df2\u7ecf\u79ef\u7d2f\u7684\u8bc1\u636e\u3002",
      guidePresentDescription:
        "\u8861\u91cf\u5f53\u4e0b\u7684\u72b6\u6001\u3001\u9650\u5236\u6761\u4ef6\u4e0e\u53ef\u7528\u8d44\u6e90\u3002",
      guideFutureDescription:
        "\u8861\u91cf\u957f\u671f\u6536\u76ca\u3001\u6f5c\u5728\u4ef7\u503c\u4e0e\u6267\u884c\u7a7a\u95f4\u3002",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("zh");

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      copy: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}
