import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScoreSlider from "../components/ScoreSlider.jsx";
import { personalityOptions } from "../constants/personalityOptions.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { loadAnonymousId } from "../services/anonymousId.js";
import { saveDecisionResult, submitDecisionScore } from "../services/decisionApi.js";
import {
  DEFAULT_PERSONALITY_TYPE,
  loadPersonalityPreference,
} from "../services/personalityPreference.js";

const initialFormState = {
  scale_type: "hundred",
  personality_type: DEFAULT_PERSONALITY_TYPE,
  past_score: 50,
  present_score: 50,
  future_score: 50,
};

export default function AssessmentPage() {
  const { copy, language } = useLanguage();
  const navigate = useNavigate();
  const options = personalityOptions[language];
  const [formState, setFormState] = useState(() => ({
    ...initialFormState,
    personality_type: loadPersonalityPreference(),
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const selectedPersonalityLabel =
    options.find((option) => option.value === formState.personality_type)?.label ??
    options[0]?.label ??
    "";
  const isTenScale = formState.scale_type === "ten";
  const scoreRangeHint = isTenScale ? "0 - 10" : copy.assessment.rangeHint;
  const scoreMax = isTenScale ? 10 : 100;

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "scale_type") {
      setFormState((current) => {
        if (value === current.scale_type) {
          return current;
        }

        const nextScaleIsTen = value === "ten";
        const convertScore = (score) =>
          nextScaleIsTen ? Math.round(score / 10) : Math.round(score * 10);

        return {
          ...current,
          scale_type: value,
          past_score: convertScore(current.past_score),
          present_score: convertScore(current.present_score),
          future_score: convertScore(current.future_score),
        };
      });

      return;
    }

    setFormState((current) => ({
      ...current,
      [name]: Number(value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const multiplier = formState.scale_type === "ten" ? 10 : 1;
      const result = await submitDecisionScore({
        anonymous_id: loadAnonymousId(),
        personality_type: formState.personality_type,
        scale_type: formState.scale_type,
        input_past_score: formState.past_score,
        input_present_score: formState.present_score,
        input_future_score: formState.future_score,
        past_score: formState.past_score * multiplier,
        present_score: formState.present_score * multiplier,
        future_score: formState.future_score * multiplier,
      });
      saveDecisionResult(result);
      navigate("/result", { state: { result } });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="content-grid">
      <section className="card">
        <p className="eyebrow">{copy.assessment.eyebrow}</p>
        <h2>{copy.assessment.title}</h2>
        <p className="helper-text">{copy.assessment.description}</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="scale_type">{copy.assessment.scaleType}</label>
            <select
              id="scale_type"
              name="scale_type"
              onChange={handleChange}
              value={formState.scale_type}
            >
              <option value="hundred">{copy.assessment.hundredScale}</option>
              <option value="ten">{copy.assessment.tenScale}</option>
            </select>
          </div>

          <div className="field">
            <label>{copy.assessment.personalityType}</label>
            <div className="field-value">{selectedPersonalityLabel}</div>
          </div>

          <ScoreSlider
            id="past_score"
            label={copy.assessment.pastScore}
            max={scoreMax}
            min={0}
            name="past_score"
            onChange={handleChange}
            rangeHint={scoreRangeHint}
            step={1}
            value={formState.past_score}
          />
          <ScoreSlider
            id="present_score"
            label={copy.assessment.presentScore}
            max={scoreMax}
            min={0}
            name="present_score"
            onChange={handleChange}
            rangeHint={scoreRangeHint}
            step={1}
            value={formState.present_score}
          />
          <ScoreSlider
            id="future_score"
            label={copy.assessment.futureScore}
            max={scoreMax}
            min={0}
            name="future_score"
            onChange={handleChange}
            rangeHint={scoreRangeHint}
            step={1}
            value={formState.future_score}
          />

          {errorMessage ? (
            <div className="error-banner" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div className="button-row">
            <button className="button" disabled={isSubmitting} type="submit">
              {isSubmitting ? copy.assessment.submitting : copy.assessment.submit}
            </button>
          </div>
        </form>
      </section>

      <aside className="card">
        <p className="eyebrow">{copy.assessment.guide}</p>
        <div className="panel-list">
          <div className="panel-item">
            <strong>{copy.assessment.past}</strong>
            <p className="helper-text">{copy.assessment.pastDescription}</p>
          </div>
          <div className="panel-item">
            <strong>{copy.assessment.present}</strong>
            <p className="helper-text">{copy.assessment.presentDescription}</p>
          </div>
          <div className="panel-item">
            <strong>{copy.assessment.future}</strong>
            <p className="helper-text">{copy.assessment.futureDescription}</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
