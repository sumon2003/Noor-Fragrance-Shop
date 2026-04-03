import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); 

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // registration Call
      await register({ name, email, password });
      
      setIsSuccess(true);
    } catch (e2) {
      setErr(e2.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-amber-50/90 bg-black">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-200px)]">
        
        {/* Success Message */}
        {isSuccess ? (
          <div className="w-full rounded-[2.5rem] bg-white/5 border border-amber-300/10 p-10 text-center space-y-6 backdrop-blur-xl animate-in zoom-in duration-500">
            <div className="inline-flex p-5 rounded-full bg-amber-300/10 text-amber-300 mb-2">
              <Mail size={48} className="animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold text-white">Check Your Email</h1>
            <p className="text-amber-50/60 leading-relaxed">
              We've sent a verification link to <span className="text-amber-300 font-semibold">{email}</span>. 
              Please verify your email to activate your account.
            </p>
            <div className="pt-4">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 bg-amber-300 text-black px-8 py-3 rounded-2xl font-bold hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.15)]"
              >
                Go to Login <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="w-full rounded-[2.5rem] bg-white/5 border border-amber-300/10 p-8 md:p-10 backdrop-blur-md">
            <div className="space-y-2 mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
              <p className="text-amber-50/50">Join Noor Fragrance for a premium experience</p>
            </div>

            {err && (
              <div className="mb-6 rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-red-200 text-sm flex items-center gap-3 animate-in slide-in-from-top duration-300">
                <span className="shrink-0 h-2 w-2 rounded-full bg-red-500"></span>
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-50/70 ml-1">Full Name</label>
                <input
                  className="w-full rounded-2xl bg-black/40 border border-amber-300/10 px-5 py-4 outline-none focus:border-amber-300/40 focus:ring-4 focus:ring-amber-300/5 transition-all text-white"
                  placeholder="Md Sumon Hossain"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-50/70 ml-1">Email Address</label>
                <input
                  className="w-full rounded-2xl bg-black/40 border border-amber-300/10 px-5 py-4 outline-none focus:border-amber-300/40 focus:ring-4 focus:ring-amber-300/5 transition-all text-white"
                  placeholder="sumon@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-50/70 ml-1">Password</label>
                <input
                  className="w-full rounded-2xl bg-black/40 border border-amber-300/10 px-5 py-4 outline-none focus:border-amber-300/40 focus:ring-4 focus:ring-amber-300/5 transition-all text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>

              <button
                disabled={loading}
                className="w-full mt-4 rounded-2xl bg-amber-300 text-black font-bold py-4 hover:bg-amber-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(251,191,36,0.3)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center pt-4 text-sm text-amber-50/40">
                Already have an account?{" "}
                <Link className="text-amber-300 font-semibold hover:text-amber-200 transition" to="/login">
                  Login here
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}