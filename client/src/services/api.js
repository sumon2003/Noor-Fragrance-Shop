const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

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

  // FormData 
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const url = API_BASE.endsWith('/') ? `${API_BASE}${cleanPath}` : `${API_BASE}/${cleanPath}`;

  const res = await fetch(url, {
    ...options,
    headers,
    body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  });

  // JSON parse safely 
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body, headers = {}) => request(path, { method: "POST", body, headers }),
  put: (path, body, headers = {}) => request(path, { method: "PUT", body, headers }),
  del: (path) => request(path, { method: "DELETE" }),
};