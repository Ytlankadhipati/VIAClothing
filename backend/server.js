import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config(); // fallback

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { autoSeedIfEmpty } from "./utils/seedData.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();

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
