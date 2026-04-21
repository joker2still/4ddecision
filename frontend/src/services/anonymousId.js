const ANONYMOUS_ID_STORAGE_KEY = "decision-anonymous-id";

function createAnonymousId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadAnonymousId() {
  const savedId = localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
  if (savedId) {
    return savedId;
  }

  const anonymousId = createAnonymousId();
  localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, anonymousId);
  return anonymousId;
}
