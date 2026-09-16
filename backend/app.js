import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
// Removed express-mongo-sanitize import and usage due to Express 5 compatibility
// Body sanitization for req.body, req.query, req.params

import { errorHandler } from "./middleware/error.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// Logging in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Cookie parser
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://via-clothing.vercel.app",
  "https://main.d3nidkqcrf8n6y.amplifyapp.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev for seamless testing
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// NoSQL injection protection — strips keys starting with $ or containing . from
// req.body, req.query, and req.params before they reach any route handler.
// Body parser – already applied above
// NoSQL injection protection – sanitize only req.body using express-mongo-sanitize to avoid tampering with request query/params which can cause errors in Express 5.


// Manual sanitization for query strings and URL params – strip keys that start with "$" or contain "." to prevent NoSQL injection.
function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }
}
app.use((req, res, next) => {
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
// Mounted BEFORE apiLimiter so uptime monitors (UptimeRobot, etc.) never get
// rate-limited. Returns 503 if the Mongoose connection is not ready.
app.get("/api/health", (req, res) => {
  const dbReady = mongoose.connection.readyState === 1; // 1 = connected
  if (!dbReady) {
    return res.status(503).json({
      success: false,
      status: "degraded",
      db: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
  res.status(200).json({
    success: true,
    status: "ok",
    db: "connected",
    brand: "VIA — Vibe • Identity • Authenticity",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});
// ──────────────────────────────────────────────────────────────────────────────

// Rate limiter — applied to all /api routes EXCEPT /api/health above
app.use("/api", apiLimiter);

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// 404 Route Catch-All — no path arg catches all unmatched routes (Express 5 compatible)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
