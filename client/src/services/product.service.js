// client/src/services/product.service.js

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

const PRODUCTS_BASE = `${API_BASE}/api/products`;

async function handle(res) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchProducts({ category, q, sort } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);

  const url = params.toString()
    ? `${PRODUCTS_BASE}?${params.toString()}`
    : `${PRODUCTS_BASE}`;

  const res = await fetch(url);
  return handle(res);
}

export async function fetchProductById(id) {
  const res = await fetch(`${PRODUCTS_BASE}/${id}`);
  return handle(res);
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(`${PRODUCTS_BASE}/slug/${slug}`);
  return handle(res);
}
