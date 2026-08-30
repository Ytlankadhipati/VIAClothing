import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { Lock, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setSubmitting(true);
      await authService.resetPassword(token, password);
      addToast("Password reset successful! You are now logged in.", "success");
      navigate("/account");
    } catch (err) {
      addToast(err.message || "Failed to reset password", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="font-heading font-black tracking-widest text-2xl uppercase text-zinc-900">
            NEW PASSWORD
          </h2>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">
            Choose a strong password for your VIA account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              New Password
            </label>
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {submitting ? "Resetting..." : "Save New Password"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
