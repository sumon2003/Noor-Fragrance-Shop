// client/src/services/product.service.js

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Frontend base (vite) - so local public images will work
const FRONT_BASE = typeof window !== "undefined" ? window.location.origin : "";

function normalizeImagePath(path) {
  if (!path) return "";

  // If already absolute URL, keep it
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // If it's relative without slash, turn into "/..."
  if (!path.startsWith("/")) path = `/${path}`;

  // Now make it absolute to frontend origin
  return `${FRONT_BASE}${path}`;
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();

  return data.map((p) => ({
    ...p,
    // unify image field for UI
    image: normalizeImagePath(p.image || p.imageUrl || ""),
  }));
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const p = await res.json();

  return {
    ...p,
    image: normalizeImagePath(p.image || p.imageUrl || ""),
  };
}
