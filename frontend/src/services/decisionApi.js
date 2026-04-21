const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
const STORAGE_KEY = "decision-score-result";

export async function submitDecisionScore(payload) {
  const response = await fetch(`${API_BASE_URL}/api/decision-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const detail = data?.detail;
    const message =
      Array.isArray(detail) && detail.length > 0
        ? detail.map((item) => item.msg).join("; ")
        : detail || "Request failed.";

    throw new Error(message);
  }

  return data;
}

export function saveDecisionResult(result) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadDecisionResult() {
  const rawValue = localStorage.getItem(STORAGE_KEY);
  return rawValue ? JSON.parse(rawValue) : null;
}
