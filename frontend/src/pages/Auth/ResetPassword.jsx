import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-black transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-black transition-colors focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
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
