import { apiGet } from "./api";

export function fetchProducts() {
  return apiGet("/api/products");
}
