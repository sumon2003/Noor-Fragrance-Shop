import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("Sumon");
  const [email, setEmail] = useState("sumon2@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register({ name, email, password });
      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-amber-50/90">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6">
          <h1 className="text-2xl font-semibold">Create Account</h1>

          {err && (
            <div className="mt-4 rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 p-3 text-red-200 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-amber-50/70">Name</label>
              <input
                className="mt-2 w-full rounded-2xl bg-black/30 ring-1 ring-amber-300/15 px-4 py-3 outline-none focus:ring-amber-300/35"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-amber-50/70">Email</label>
              <input
                className="mt-2 w-full rounded-2xl bg-black/30 ring-1 ring-amber-300/15 px-4 py-3 outline-none focus:ring-amber-300/35"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-sm text-amber-50/70">Password</label>
              <input
                className="mt-2 w-full rounded-2xl bg-black/30 ring-1 ring-amber-300/15 px-4 py-3 outline-none focus:ring-amber-300/35"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-amber-300 text-black font-semibold py-3 hover:bg-amber-200 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>

            <div className="text-sm text-amber-50/60">
              Already have account?{" "}
              <Link className="text-amber-300 hover:text-amber-200" to="/login">
                Login
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
