import { v2 as cloudinary } from "cloudinary";

// NOTE: Do NOT call cloudinary.config() here at module load time.
// In ES Modules, all `import` statements are evaluated before the
// importing file's own top-level code (like dotenv.config()) runs —
// so reading process.env here would see undefined values and silently
// fall back to "dummy_key", even if .env is set up correctly.
// Instead, we configure lazily on first use, by which point
// dotenv.config() in server.js has already populated process.env.
let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "via-clothing",
    api_key: process.env.CLOUDINARY_API_KEY || "dummy_key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "dummy_secret",
  });
  configured = true;
}

const originalUpload = cloudinary.uploader.upload.bind(cloudinary.uploader);
cloudinary.uploader.upload = (...args) => {
  ensureConfigured();
  return originalUpload(...args);
};

export default cloudinary;