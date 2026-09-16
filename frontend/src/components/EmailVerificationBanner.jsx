import React, { useState } from "react";
import { AlertTriangle, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import OtpVerificationModal from "./OtpVerificationModal";

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);

  if (!user || user.emailVerified || dismissed) return null;

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              <span className="font-bold">Your email is not verified.</span>{" "}
              Please verify your email to unlock all features.{" "}
              <button
                onClick={() => setOtpOpen(true)}
                className="font-black text-amber-900 underline underline-offset-2 hover:text-black transition-colors"
              >
                Verify now
              </button>
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-500 hover:text-amber-800 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerified={() => setOtpOpen(false)}
      />
    </>
  );
}
