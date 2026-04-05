import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, XCircle, Loader2, PartyPopper, ArrowRight } from "lucide-react";

// API Base URL handling
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate(); 
  
  // Strict mode 
  const hasCalled = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token || hasCalled.current) {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
        }
        return;
    }

    const doVerify = async () => {
      hasCalled.current = true; 

      try {
        const res = await fetch(`${API_BASE}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Congratulations! Your email is verified.");
          
          // after 3 seconds redirect to login
          setTimeout(() => {
            nav("/login"); 
          }, 3500);
        } else {
          setStatus("error");
          setMessage(data.message || "The verification link might be expired or invalid.");
        }
      } catch (e) {
        setStatus("error");
        setMessage("Connection failed. Please check your internet or try again.");
      }
    };

    doVerify();
  }, [token, nav]); 

  return (
    <div className="min-h-screen text-amber-50/90 bg-[#050505] selection:bg-amber-300 selection:text-black">
      <Navbar />
      
      <main className="max-w-xl mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center relative">
        {/* Background Glow Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full rounded-[3rem] bg-white/[0.03] border border-amber-300/10 p-12 backdrop-blur-2xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          {/* Loading State */}
          {status === "loading" && (
            <div className="space-y-8 py-10">
              <div className="flex justify-center">
                <div className="relative">
                    <Loader2 size={80} className="text-amber-300 animate-spin opacity-20" />
                    <Loader2 size={80} className="text-amber-300 animate-spin absolute inset-0" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Securing Your Account</h1>
                <p className="text-amber-50/40 animate-pulse text-sm">Authenticating your unique token...</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              <div className="flex justify-center">
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-300/20 to-transparent text-amber-300 shadow-inner">
                    <PartyPopper size={70} className="animate-bounce" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-white tracking-tighter italic">WELCOME ABOARD!</h1>
                <p className="text-amber-50/60 text-lg leading-relaxed">{message}</p>
              </div>
              
              <div className="pt-8">
                <Link 
                  to="/login" 
                  className="group/btn inline-flex items-center justify-center gap-3 w-full px-8 py-5 rounded-[1.5rem] bg-amber-300 text-black font-black text-lg transition-all hover:bg-amber-200 hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-300/10"
                >
                  START SHOPPING <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <p className="text-[10px] text-amber-50/20 mt-4 uppercase tracking-[0.2em]">Redirecting in 3 seconds...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center">
                <div className="p-8 rounded-[2rem] bg-red-500/10 text-red-400 border border-red-500/20">
                    <XCircle size={70} />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">Verification Failed</h1>
                <p className="text-red-200/50 max-w-[280px] mx-auto text-sm">{message}</p>
              </div>
              <div className="pt-6 flex flex-col gap-4">
                <Link to="/register" className="w-full py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                  Request New Link
                </Link>
                <Link to="/" className="text-amber-300/40 text-xs font-bold hover:text-amber-300 transition">Back to Home</Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}