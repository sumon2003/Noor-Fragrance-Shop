import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("sumonkhanbd2003@gmail.com"); 
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      
      // লগইন সফল হলে চেক করা হচ্ছে সে কি অ্যাডমিন কি না
      if (data?.user?.isAdmin) {
        nav("/admin", { replace: true });
      } else {
        nav("/", { replace: true });
      }
    } catch (e2) {
      setErr(e2.response?.data?.message || e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-amber-50/90 bg-[#0a0a0a]">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-12 pt-32">
        <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-amber-300">Welcome Back</h1>
          <p className="mt-2 text-amber-50/60 text-sm">Access your Noor Fragrance account</p>

          {err && (
            <div className="mt-6 rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-red-200 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-amber-50/70 ml-1">Email Address</label>
              <input
                className="mt-2 w-full rounded-2xl bg-black/40 ring-1 ring-amber-300/15 px-5 py-4 outline-none focus:ring-amber-300/40 transition-all text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-amber-50/70 ml-1">Password</label>
              <input
                className="mt-2 w-full rounded-2xl bg-black/40 ring-1 ring-amber-300/15 px-5 py-4 outline-none focus:ring-amber-300/40 transition-all text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                type="password"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full mt-4 rounded-2xl bg-amber-300 text-black font-bold py-4 hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.15)] disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "LOGIN TO ACCOUNT"}
            </button>

            <div className="text-center pt-4 text-sm text-amber-50/60">
              New to Noor Fragrance?{" "}
              <Link className="text-amber-300 font-semibold hover:text-amber-200 underline underline-offset-4" to="/register">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}