import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  // JWT_SECRET is validated at server startup — if we reach here, it is set.
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

export const sendTokenResponse = (user, statusCode, res, message = "Authenticated successfully") => {
  const token = generateToken(user._id, user.role);

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRES_IN || "7", 10);
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    avatar: user.avatar || "",
    addresses: user.addresses || [],
    wishlist: user.wishlist || [],
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      data: {
        user: userPayload,
      },
    });
};
