import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

export const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_via_streetwear_demo";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_via_demo_key";

    try {
      razorpayInstance = new Razorpay({
        key_id,
        key_secret,
      });
    } catch (err) {
      console.warn("[Razorpay] Initialized in development fallback mode:", err.message);
    }
  }
  return razorpayInstance;
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_via_demo_key";
  
  // If in demo/test fallback mode with mock test signatures, allow development simulation
  if (process.env.NODE_ENV === "development" && signature.startsWith("demo_sig_")) {
    return true;
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature === signature;
};
