import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

function normalizeApiError(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.details ||
      error.message ||
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Backend belum merespons health check.");
  }

  return response.json();
}

export async function getFormMeta() {
  const response = await api.get("/meta/form");
  return response.data;
}

export async function createPrediction(payload) {
  const response = await api.post("/predictions", payload);
  return response.data;
}

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary");
  return response.data;
}

export async function getPredictionHistory(params = {}) {
  const response = await api.get("/predictions", { params });
  return response.data;
}

export { API_BASE_URL, normalizeApiError };
