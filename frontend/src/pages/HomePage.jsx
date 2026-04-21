import { useState } from "react";
import { Link } from "react-router-dom";
import { personalityOptions } from "../constants/personalityOptions.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import {
  loadPersonalityPreference,
  savePersonalityPreference,
} from "../services/personalityPreference.js";

export default function HomePage() {
  const { copy, language } = useLanguage();
  const options = personalityOptions[language];
  const [personalityType, setPersonalityType] = useState(() =>
    loadPersonalityPreference()
  );

  function handlePersonalityChange(event) {
    const nextValue = savePersonalityPreference(event.target.value);
    setPersonalityType(nextValue);
  }

  return (
    <main className="home-shell">
      <section className="card home-card">
        <h2>{copy.home.title}</h2>

        <div className="field home-personality-picker">
          <label htmlFor="home_personality_type">
            {copy.assessment.personalityType}
          </label>
          <select
            id="home_personality_type"
            name="personality_type"
            onChange={handlePersonalityChange}
            value={personalityType}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="cta-row">
          <Link className="button" to="/assessment">
            {copy.home.start}
          </Link>
          <Link className="button-secondary" to="/result">
            {copy.home.latest}
          </Link>
        </div>
      </section>
    </main>
  );
}
