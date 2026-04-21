import { useLanguage } from "../contexts/LanguageContext.jsx";
import {
  getDecisionLabel,
  getMessageLabel,
} from "../utils/resultText.js";

export default function ResultSummary({ result }) {
  const { copy, language } = useLanguage();

  return (
    <div className="result-grid">
      <div className="result-highlight">
        <div className="result-box">
          <span className="eyebrow">{copy.result.score}</span>
          <strong>{result.score}</strong>
        </div>

        <div className="result-box">
          <span className="eyebrow">{copy.result.decision}</span>
          <strong>{getDecisionLabel(result.decision, language)}</strong>
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">{copy.result.message}</span>
        <p>{getMessageLabel(result.message, language)}</p>
      </div>

      <div className="card">
        <span className="eyebrow">{copy.result.detailedGuide}</span>
        <div className="guide-list">
          <div className="guide-item">
            <div className="guide-card">
              <strong>{copy.assessment.past}</strong>
              <p>{copy.result.guidePastDescription}</p>
            </div>
          </div>
          <div className="guide-item">
            <div className="guide-card">
              <strong>{copy.assessment.present}</strong>
              <p>{copy.result.guidePresentDescription}</p>
            </div>
          </div>
          <div className="guide-item">
            <div className="guide-card">
              <strong>{copy.assessment.future}</strong>
              <p>{copy.result.guideFutureDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
