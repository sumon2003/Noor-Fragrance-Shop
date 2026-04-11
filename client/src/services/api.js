const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://noor-aroma.vercel.app/api";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const baseUrl = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`;
  const url = `${baseUrl}${cleanPath}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data?.message || `Request failed (${res.status})`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body, headers = {}) => request(path, { method: "POST", body, headers }),
  put: (path, body, headers = {}) => request(path, { method: "PUT", body, headers }),
  del: (path) => request(path, { method: "DELETE" }),
};