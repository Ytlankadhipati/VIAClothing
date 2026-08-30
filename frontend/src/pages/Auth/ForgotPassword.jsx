import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      await authService.forgotPassword(email);
      setSubmitted(true);
      addToast("Password reset link sent to your email", "success");
    } catch (err) {
      addToast(err.message || "Failed to send reset link", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="font-heading font-black tracking-widest text-2xl uppercase text-zinc-900">
            RESET PASSWORD
          </h2>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-zinc-900">Instructions Sent</p>
            <p className="text-xs text-zinc-600">
              If an account is associated with <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <Link
              to="/auth/login"
              className="inline-block mt-4 text-xs font-bold text-black uppercase tracking-wider underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Account Email
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.25em] transition-all shadow-md mt-4 disabled:bg-zinc-400"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-black uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
