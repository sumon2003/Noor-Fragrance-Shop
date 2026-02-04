import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { getToken, setToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // app start - token -> /me call - user load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setBooting(false);
      return;
    }

    (async () => {
      try {
        const data = await authService.me();
        setUser(data?.user || data); // backend response format -> safe
      } catch (e) {
        // token invalid -> remove
        setToken("");
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    setToken(data?.token);
    setUser(data?.user);
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await authService.register({ name, email, password });
    setToken(data?.token);
    setUser(data?.user);
    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({ user, booting, isAdmin, login, register, logout }),
    [user, booting, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
