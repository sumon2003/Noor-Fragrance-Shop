import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "noor_cart_v1";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload;

    case "ADD": {
      const { productId, variantId, qty, snapshot } = action.payload;
      const next = [...state];
      const idx = next.findIndex(
        (i) => i.productId === productId && i.variantId === variantId
      );

      if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      else next.push({ productId, variantId, qty, snapshot });

      return next;
    }

    case "SET_QTY": {
      const { productId, variantId, qty } = action.payload;
      return state
        .map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, qty }
            : i
        )
        .filter((i) => i.qty > 0);
    }

    case "REMOVE":
      return state.filter(
        (i) => !(i.productId === action.payload.productId && i.variantId === action.payload.variantId)
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    dispatch({ type: "INIT", payload: raw ? safeParse(raw, []) : [] });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo(() => {
    const addToCart = ({ productId, variantId, qty, snapshot }) =>
      dispatch({ type: "ADD", payload: { productId, variantId, qty, snapshot } });

    const setQty = ({ productId, variantId, qty }) =>
      dispatch({ type: "SET_QTY", payload: { productId, variantId, qty } });

    const removeItem = ({ productId, variantId }) =>
      dispatch({ type: "REMOVE", payload: { productId, variantId } });

    const clearCart = () => dispatch({ type: "CLEAR" });

    const count = items.reduce((sum, i) => sum + (i.qty || 0), 0);
    const subtotal = items.reduce(
      (sum, i) => sum + (i.qty || 0) * Number(i.snapshot?.price || 0),
      0
    );

    return { items, addToCart, setQty, removeItem, clearCart, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
