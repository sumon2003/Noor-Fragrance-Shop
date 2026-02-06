import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

export default function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setStatus("loading");
        setMessage("Verifying your email...");

        const res = await fetch(`${API_BASE}/api/auth/verify-email/${token}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || "Verification failed");
        }

        if (!alive) return;

        setStatus("success");
        setMessage(data?.message || "Email verified successfully!");
      } catch (e) {
        if (!alive) return;
        setStatus("error");
        setMessage(e?.message || "Invalid or expired verification link");
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen text-amber-50/90">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-14">
        <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6">
          <h1 className="text-2xl font-semibold">Email Verification</h1>

          <div className="mt-4 text-amber-50/70">{message}</div>

          {status === "loading" && (
            <div className="mt-6 rounded-2xl bg-black/30 ring-1 ring-amber-300/10 p-4 text-sm text-amber-50/70">
              Please wait…
            </div>
          )}

          {status === "success" && (
            <div className="mt-6">
              <div className="rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-400/20 p-4 text-emerald-200 text-sm">
                ✅ Verified! Now you can login.
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  className="inline-flex justify-center px-5 py-3 rounded-2xl bg-amber-300 text-black font-semibold hover:bg-amber-200 transition"
                >
                  Go to Login
                </Link>

                <Link
                  to="/"
                  className="inline-flex justify-center px-5 py-3 rounded-2xl bg-white/5 ring-1 ring-amber-300/12 text-amber-50/80 hover:ring-amber-300/30 transition"
                >
                  Back Home
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6">
              <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-red-200 text-sm">
                ❌ {message}
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex justify-center px-5 py-3 rounded-2xl bg-amber-300 text-black font-semibold hover:bg-amber-200 transition"
                >
                  Register Again
                </Link>

                <Link
                  to="/login"
                  className="inline-flex justify-center px-5 py-3 rounded-2xl bg-white/5 ring-1 ring-amber-300/12 text-amber-50/80 hover:ring-amber-300/30 transition"
                >
                  Try Login
                </Link>
              </div>

              <div className="mt-4 text-xs text-amber-50/50">
                Tip: link expired হলে “Resend verification” আমরা next step এ add করবো।
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
