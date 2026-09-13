import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config(); // fallback

// ─── Startup Security Guard ────────────────────────────────────────────────
// Refuse to start if JWT_SECRET is missing or insecurely short.
// A weak/missing secret allows anyone to forge valid auth tokens (including admin).
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  console.error("\n[VIA Server] \u274c  FATAL: JWT_SECRET is not set or is too short (minimum 32 characters).");
  console.error("[VIA Server]    Set a strong JWT_SECRET in your .env file before starting the server.");
  console.error("[VIA Server]    Generate one with:  node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"");
  console.error("[VIA Server]    Server will not start without a valid JWT_SECRET.\n");
  process.exit(1);
}
// ──────────────────────────────────────────────────────────────────────────

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { autoSeedIfEmpty } from "./utils/seedData.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    // await autoSeedIfEmpty(); // Auto-seed disabled so custom products are not overwritten

    app.listen(PORT, () => {
      console.log(
        `[VIA Server] Production REST API running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      );
      console.log(`[VIA Server] API URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("[VIA Server] Fatal startup error:", err.message);
    process.exit(1);
  }
};

startServer();
