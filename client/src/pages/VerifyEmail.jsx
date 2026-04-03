import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // useNavigate যোগ করা হয়েছে
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Loader2, PartyPopper } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate(); // এখানে nav ফাংশনটি ডিফাইন করা হলো

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let alive = true;

    const doVerify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No token provided.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (!alive) return;

        if (res.ok) {
          setStatus("success");
          setMessage("Congratulations! Your email is verified.");
          
          // ৩ সেকেন্ড পর লগইন পেজে রিডাইরেক্ট
          setTimeout(() => {
            if (alive) nav("/login"); // এখন এটি কাজ করবে
          }, 3000);
        } else {
          throw new Error(data.message || "Verification failed");
        }
      } catch (e) {
        if (!alive) return;
        setStatus("error");
        setMessage(e.message);
      }
    };

    doVerify();
    return () => { alive = false; };
  }, [token, nav]); // dependency list এ nav যোগ করা হলো

  return (
    <div className="min-h-screen text-amber-50/90 bg-black">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center">
        {/* বাকি ডিজাইন যা ছিল সব ঠিক আছে... */}
        <div className="w-full rounded-[3rem] bg-white/5 border border-amber-300/10 p-10 backdrop-blur-xl text-center shadow-2xl relative overflow-hidden">
          
          {status === "loading" && (
            <div className="space-y-6 animate-pulse">
              <div className="flex justify-center"><Loader2 size={64} className="text-amber-300 animate-spin" /></div>
              <h1 className="text-2xl font-bold text-white">Verifying...</h1>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <div className="flex justify-center"><div className="p-6 rounded-full bg-amber-300/10 text-amber-300"><PartyPopper size={64} /></div></div>
              <h1 className="text-4xl font-black text-white">Congratulations!</h1>
              <p className="text-amber-50/70 text-lg">Your email is verified. Redirecting to login...</p>
              <div className="pt-6">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full px-8 py-5 rounded-2xl bg-amber-300 text-black font-bold">Go to Login <CheckCircle2 size={20} /></Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-center"><div className="p-6 rounded-full bg-red-500/10 text-red-400"><XCircle size={64} /></div></div>
              <h1 className="text-3xl font-bold text-white">Oops!</h1>
              <p className="text-red-200/60">{message}</p>
              <div className="pt-6 flex flex-col gap-3">
                <Link to="/register" className="w-full py-4 rounded-2xl bg-amber-300 text-black font-bold">Try Registering Again</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}