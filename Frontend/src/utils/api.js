const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://mediastack.in").replace(/\/+$/, "");

export const API_V1_URL = `${API_BASE_URL}/api/v1`;
