import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import OtpVerificationModal from "../../components/OtpVerificationModal";
import { ArrowRight, Mail, User, Phone, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { register, googleLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
      const newUser = await register({ name, email, phone, password });
      addToast("Account created! Please verify your email.", "success");
      // Show OTP modal for email/password signups
      if (newUser && !newUser.emailVerified) {
        setShowOtpModal(true);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      addToast(err.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      const loggedUser = await googleLogin(credentialResponse.credential);
      addToast("Account created with Google. Welcome to VIA!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || "Google Sign-In failed. Please try again.", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    navigate(from, { replace: true });
  };

  const handleSkipOtp = () => {
    setShowOtpModal(false);
    navigate(from, { replace: true });
  };

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-md w-full bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg animate-fadeIn">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <img src="/assets/via-logo.png" alt="VIA" className="h-12 w-auto mx-auto object-contain" />
            </Link>
            <h2 className="font-heading font-black tracking-widest text-2xl uppercase text-zinc-900">JOIN VIA</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Vibe • Identity • Authenticity</p>
          </div>

          {/* Google Sign-Up */}
          <div className="mb-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => addToast("Google Sign-In was cancelled or failed.", "error")}
                useOneTap={false}
                width="368"
                text="signup_with"
                shape="rectangular"
                theme="outline"
                locale="en"
              />
            </div>
            {googleLoading && <p className="text-center text-xs text-zinc-400 mt-2">Signing up with Google...</p>}
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Or register with email</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Full Name</label>
              <div className="relative">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Aryan Sharma"
                  className="w-full px-4 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white" />
                <User className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aryan@example.com"
                  className="w-full px-4 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white" />
                <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white" />
                <Phone className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-black transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-black transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-md mt-6 disabled:bg-zinc-400">
              {submitting ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-bold text-black uppercase tracking-wider hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal auto-opens after email/password registration */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={handleSkipOtp}
        onVerified={handleOtpVerified}
      />
    </>
  );
}
