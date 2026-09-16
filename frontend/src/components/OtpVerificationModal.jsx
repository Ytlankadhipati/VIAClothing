import React, { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function OtpVerificationModal({ isOpen, onClose, onVerified }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  const { verifyOtp, resendOtp } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 80);
    }
    if (!isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setSuccess(false);
      setResendCooldown(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      addToast("Please enter all 6 digits of the verification code.", "error");
      return;
    }
    try {
      setSubmitting(true);
      await verifyOtp(code);
      setSuccess(true);
      addToast("Email verified successfully! Welcome to VIA.", "success");
      setTimeout(() => { onVerified?.(); onClose?.(); }, 1500);
    } catch (err) {
      addToast(err.message || "Invalid code. Please try again.", "error");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    try {
      setResending(true);
      await resendOtp();
      addToast("A new verification code has been sent to your email.", "success");
      setResendCooldown(30);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err) {
      addToast(err.message || "Failed to resend code.", "error");
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">Verify Your Email</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-6">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="font-black uppercase tracking-widest text-zinc-900 text-sm">Email Verified!</p>
              <p className="text-xs text-zinc-500 mt-1">Redirecting you now...</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                We sent a <strong>6-digit code</strong> to your email address. Enter it below — it expires in 10 minutes.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 justify-center mb-6" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-black border border-zinc-300 focus:border-black outline-none bg-white tracking-wide transition-colors"
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={submitting || otp.join("").length < 6}
                  className="w-full py-3.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-black text-xs uppercase tracking-[0.2em] transition-all"
                >
                  {submitting ? "Verifying..." : "Verify Email"}
                </button>
              </form>
              <div className="mt-5 text-center">
                <p className="text-xs text-zinc-500">
                  Did not receive it?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-zinc-400 font-semibold">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="font-bold text-black hover:underline inline-flex items-center gap-1 disabled:text-zinc-400"
                    >
                      {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
                      {resending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
