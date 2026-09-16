import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { sendTokenResponse } from "../utils/token.js";
import emailService from "../services/emailService.js";

const getGoogleClient = () => {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
};

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please provide name, email, and password.");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, "An account with this email already exists.");
    }

    // Generate a 6-digit numeric OTP valid for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || "",
      role: "customer",
      authProvider: "local",
      emailVerified: false,
      emailOTP: {
        code: otp,
        expiresAt: otpExpires,
      },
    });

    // Send OTP verification email
    emailService.sendOtpEmail(user, otp).catch((err) => {
      console.error("[Email Service] Failed to dispatch OTP email:", err.message);
    });

    // Send welcome email asynchronously
    emailService.sendWelcomeEmail(user).catch(() => {});

    sendTokenResponse(user, 201, res, "Account registered successfully. Verification code sent.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Please provide email and password.");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    sendTokenResponse(user, 200, res, "Logged in successfully.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return successResponse(res, 200, "Logged out successfully.");
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-emailOTP").populate("wishlist");
    return successResponse(res, 200, "User profile retrieved.", { user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, gender } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (gender !== undefined) fieldsToUpdate.gender = gender;

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, "Profile updated successfully.", { user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, "Please provide current and new password.");
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 400, "New password must be at least 6 characters.");
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 401, "Current password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Forgot password - generate reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, "Please provide your email address.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return successResponse(res, 200, "If an account exists with this email, a password reset link has been sent.");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    emailService.sendPasswordResetEmail(user, resetToken).catch(() => {});

    return successResponse(res, 200, "Password reset email sent.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return errorResponse(res, 400, "Please provide a password of at least 6 characters.");
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired password reset token.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successful. You are now logged in.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add shipping address
 * @route   POST /api/auth/addresses
 * @access  Private
 */
export const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, landmark, isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return errorResponse(res, 400, "Please fill in all required address fields.");
    }

    const user = await User.findById(req.user._id);

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      fullName,
      phone,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      postalCode,
      country: country || "India",
      landmark: landmark || "",
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();

    return successResponse(res, 201, "Address added successfully.", { addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete shipping address
 * @route   DELETE /api/auth/addresses/:id
 * @access  Private
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
    await user.save();

    return successResponse(res, 200, "Address deleted successfully.", { addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate with Google ID Token (Google Identity Services)
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return errorResponse(res, 400, "Google ID token is required.");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("[Google Auth] Fatal: GOOGLE_CLIENT_ID is not configured in backend environment.");
      return errorResponse(res, 500, "Google Sign-In is not configured on the server.");
    }

    const client = getGoogleClient();
    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn("[Google Auth] Token verification failed:", verifyErr.message);
      return errorResponse(res, 401, "Invalid or expired Google authentication token.");
    }

    if (!payload || !payload.email) {
      return errorResponse(res, 401, "Unable to extract email from Google identity token.");
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase();

    // 1. Check if user already exists with this googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // 2. Check if user exists with the same email (e.g. registered via local email/password)
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // Link Google ID to existing account
        user.googleId = googleId;
        user.emailVerified = true;
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
        await user.save();
      } else {
        // 3. Create a brand new Google user
        user = await User.create({
          name: name || "VIA Customer",
          email: normalizedEmail,
          googleId,
          authProvider: "google",
          emailVerified: true,
          avatar: picture || "",
          role: "customer",
        });

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(user).catch(() => {});
      }
    }

    sendTokenResponse(user, 200, res, "Signed in with Google successfully.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify email address using 6-digit OTP
 * @route   POST /api/auth/verify-otp
 * @access  Private
 */
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return errorResponse(res, 400, "Please provide the 6-digit verification code.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, "User account not found.");
    }

    if (user.emailVerified) {
      return successResponse(res, 200, "Email address is already verified.", { emailVerified: true });
    }

    if (!user.emailOTP || !user.emailOTP.code || !user.emailOTP.expiresAt) {
      return errorResponse(
        res,
        400,
        "No active verification code found. Please request a new code."
      );
    }

    if (new Date() > new Date(user.emailOTP.expiresAt)) {
      return errorResponse(
        res,
        400,
        "Verification code has expired. Please request a new code."
      );
    }

    if (String(user.emailOTP.code).trim() !== String(otp).trim()) {
      return errorResponse(res, 400, "Invalid verification code. Please check and try again.");
    }

    user.emailVerified = true;
    user.emailOTP = undefined;
    await user.save();

    return successResponse(res, 200, "Email verified successfully!", { emailVerified: true });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Resend email verification OTP
 * @route   POST /api/auth/resend-otp
 * @access  Private
 */
export const resendEmailOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, "User account not found.");
    }

    if (user.emailVerified) {
      return successResponse(res, 200, "Email address is already verified.", { emailVerified: true });
    }

    // Generate new 6-digit OTP valid for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOTP = {
      code: otp,
      expiresAt: otpExpires,
    };
    await user.save();

    // Send OTP verification email
    await emailService.sendOtpEmail(user, otp);

    return successResponse(res, 200, "A new 6-digit verification code has been sent to your email.");
  } catch (err) {
    next(err);
  }
};

