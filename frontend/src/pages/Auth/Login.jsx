import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please enter both email and password", "error");
      return;
    }

    try {
      setSubmitting(true);
      const loggedUser = await login(email, password);
      addToast("Welcome back to VIA", "success");
      if (loggedUser?.role === "admin" && (!location.state?.from || from === "/")) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      addToast(err.message || "Invalid credentials", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/assets/via-logo.png"
              alt="VIA"
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="font-heading font-black tracking-widest text-2xl uppercase text-zinc-900">
            SIGN IN
          </h2>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">
            Access private capsule drops & orders
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="mb-6 p-3 bg-zinc-50 border border-zinc-200 text-xs">
          <p className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] mb-1">
            ⚡ Quick Demo Accounts:
          </p>
          <div className="flex flex-col gap-1 text-[11px] text-zinc-600">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@viaclothing.in");
                setPassword("Admin@VIA2026");
              }}
              className="text-left hover:text-black font-semibold underline"
            >
              • Admin: admin@viaclothing.in / Admin@VIA2026
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("customer@viaclothing.in");
                setPassword("Customer@VIA2026");
              }}
              className="text-left hover:text-black font-semibold underline"
            >
              • Customer: customer@viaclothing.in / Customer@VIA2026
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-[11px] font-bold text-zinc-500 hover:text-black uppercase tracking-wider"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-md mt-6 disabled:bg-zinc-400"
          >
            {submitting ? "Signing In..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-600">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-bold text-black uppercase tracking-wider hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
