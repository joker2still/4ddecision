const PERSONALITY_STORAGE_KEY = "decision-personality-type";

export const DEFAULT_PERSONALITY_TYPE = "default";

const SUPPORTED_PERSONALITY_TYPES = new Set([
  DEFAULT_PERSONALITY_TYPE,
  "rational",
  "present_focused",
  "planner",
]);

export function loadPersonalityPreference() {
  const savedValue = localStorage.getItem(PERSONALITY_STORAGE_KEY);
  return SUPPORTED_PERSONALITY_TYPES.has(savedValue)
    ? savedValue
    : DEFAULT_PERSONALITY_TYPE;
}

export function savePersonalityPreference(personalityType) {
  const normalized = SUPPORTED_PERSONALITY_TYPES.has(personalityType)
    ? personalityType
    : DEFAULT_PERSONALITY_TYPE;

  localStorage.setItem(PERSONALITY_STORAGE_KEY, normalized);
  return normalized;
}
