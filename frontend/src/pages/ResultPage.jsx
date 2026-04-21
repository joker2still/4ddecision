import { Link, useLocation } from "react-router-dom";
import ResultSummary from "../components/ResultSummary.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { loadDecisionResult } from "../services/decisionApi.js";

export default function ResultPage() {
  const { copy, language } = useLanguage();
  const location = useLocation();
  const result = location.state?.result ?? loadDecisionResult();
  const footnote =
    language === "zh"
      ? "\u5982\u679c\u4e24\u79cd\u5206\u5236\u5f97\u51fa\u7684\u7ed3\u679c\u4e0d\u4e00\uff0c\u5219\u8bf4\u660e\u8fd9\u4ef6\u4e8b\u60c5\u5904\u4e8e\u53ef\u505a\u53ef\u4e0d\u505a\u7684\u4e2d\u95f4\u72b6\u6001\uff0c\u503e\u5411\u4e8e\u9009\u62e9\u767e\u5206\u6bd4\u6307\u6570\u7684\u51b3\u5b9a\u3002"
      : "If the two scoring systems produce different results, this decision is in a borderline zone where either choice could be reasonable. In that case, prefer the verdict from the percentage-based index.";

  if (!result) {
    return (
      <main className="card empty-state">
        <p className="eyebrow">{copy.result.eyebrow}</p>
        <h2>{copy.result.emptyTitle}</h2>
        <p className="helper-text">{copy.result.emptyDescription}</p>
        <div className="button-row">
          <Link className="button" to="/assessment">
            {copy.result.goAssessment}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="content-grid">
      <section>
        <p className="eyebrow">{copy.result.eyebrow}</p>
        <h2>{copy.result.title}</h2>
        <ResultSummary result={result} />
      </section>

      <aside className="card">
        <p className="eyebrow">{copy.result.nextStep}</p>
        <p className="helper-text">{copy.result.nextDescription}</p>
        <p className="result-footnote">{footnote}</p>
        <div className="button-row result-actions">
          <Link className="button" to="/assessment">
            {copy.result.rerun}
          </Link>
          <Link className="button-secondary" to="/">
            {copy.result.backHome}
          </Link>
        </div>
      </aside>
    </main>
  );
}
