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
        // Backend response user অবজেক্টের ভেতরে isAdmin আছে কি না নিশ্চিত করে সেট করা
        setUser(data?.user || data); 
      } catch (e) {
        setToken("");
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    // ডাটাবেস থেকে আসা user অবজেক্ট (যাতে isAdmin আছে) সেট করা হচ্ছে
    setToken(data?.token);
    setUser(data?.user);
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await authService.register({ name, email, password });
    // setToken(data?.token); // এটি কমেন্ট করুন বা সরিয়ে দিন
    // setUser(data?.user);   // এটিও সরিয়ে দিন
    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  // আপনার ডাটাবেসে 'isAdmin' ফিল্ডটি Boolean হিসেবে আছে, তাই সরাসরি সেটি চেক করা হচ্ছে
  const isAdmin = !!user?.isAdmin; 

  const value = useMemo(
    () => ({ 
      user, 
      booting, 
      isAdmin, // এখন এটি true/false রিটার্ন করবে
      login, 
      register, 
      logout 
    }),
    [user, booting, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}