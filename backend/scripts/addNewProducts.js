/**
 * Add 2 new products + update Last Race Club with multi-image support
 * User will upload real images via Admin Panel later
 * Run: node backend/scripts/addNewProducts.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./backend/.env" });

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

let Product;
try {
  Product = mongoose.model("Product");
} catch {
  const { default: P } = await import("../models/Product.js");
  Product = P;
}

// ── PLACEHOLDER image (user will replace via admin panel)
const PLACEHOLDER = "/assets/via-logo.png";

// ── 1. Update existing Last Race Club — add front image slot
const lrc = await Product.findOne({ slug: "last-race-club-oversized-tee" });
if (lrc) {
  // Already has back image as first image — add placeholder for front
  // Keep existing Cloudinary image, add a second slot for front
  if (lrc.images.length < 2) {
    lrc.images.push(PLACEHOLDER); // user will replace this with front image
  }
  await lrc.save();
  console.log(`✅ Updated: ${lrc.name} (${lrc.images.length} images)`);
} else {
  console.log("⚠️  Last Race Club not found — skipping update");
}

// ── 2. Eagle Crest Colorful Tee — Mauve (NEW)
const eagleMauveExists = await Product.findOne({ slug: "eagle-crest-colorful-tee-mauve" });
if (!eagleMauveExists) {
  const eagleMauve = new Product({
    name: "Eagle Crest Colorful Tee — Mauve",
    slug: "eagle-crest-colorful-tee-mauve",
    shortDescription: "Vibrant colorful eagle crest on dusty rose/mauve oversized tee.",
    description:
      "A bold statement in full color. The Eagle Crest Colorful Tee features a striking metallic VIA eagle with a crown rendered in vivid blue, orange, and red hues — 'Vibe • Identity • Authenticity' — on a dusty mauve/rose drop-shoulder silhouette. 240 GSM super combed cotton, bio-washed for a premium hand feel.",
    category: "tshirt",
    collection: "Signature Series",
    price: 599,
    compareAtPrice: 999,
    discount: "40% OFF",
    sku: "VIA-TEE-ECR-MAUVE",
    images: [PLACEHOLDER, PLACEHOLDER], // 2 slots — user uploads back view 1 & 2
    thumbnail: PLACEHOLDER,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Mauve"],
    gsm: "240 GSM Super Combed Cotton",
    fit: "Relaxed Boxy Drop-Shoulder Fit",
    material: "100% Super Combed Bio-Washed Cotton",
    featured: true,
    bestseller: false,
    newArrival: true,
    limitedEdition: true,
    tags: ["tshirt", "oversized", "mauve", "rose", "eagle", "colorful", "crest"],
    stock: 100,
    variants: ["S", "M", "L", "XL", "XXL"].map((s) => ({
      size: s,
      color: "Mauve",
      sku: `VIA-TEE-ECR-MAUVE-${s}`,
      price: 599,
      stock: 20,
    })),
  });
  await eagleMauve.save();
  console.log(`✅ Created: ${eagleMauve.name}`);
} else {
  console.log(`⚠️  Eagle Crest Mauve already exists — skipping`);
}

// ── 3. VIA Mountain Tee — Khaki (NEW)
const mountainExists = await Product.findOne({ slug: "via-mountain-oversized-tee-khaki" });
if (!mountainExists) {
  const mountain = new Product({
    name: "VIA Mountain Oversized Tee — Khaki",
    slug: "via-mountain-oversized-tee-khaki",
    shortDescription: "Minimalist mountain + compass VIA chest print on khaki.",
    description:
      "Clean lines, deep meaning. The VIA Mountain Tee features a minimalist compass star + mountain peak + red sun 'VIA' chest print on a warm khaki/camel drop-shoulder silhouette. 240 GSM super combed cotton — for those who move with purpose.",
    category: "tshirt",
    collection: "Capsule AW26",
    price: 599,
    compareAtPrice: 999,
    discount: "40% OFF",
    sku: "VIA-TEE-MTN-KHAKI",
    images: [PLACEHOLDER], // 1 slot — user uploads front image
    thumbnail: PLACEHOLDER,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Khaki"],
    gsm: "240 GSM Super Combed Cotton",
    fit: "Relaxed Boxy Drop-Shoulder Fit",
    material: "100% Super Combed Bio-Washed Cotton",
    featured: false,
    bestseller: false,
    newArrival: true,
    limitedEdition: false,
    tags: ["tshirt", "oversized", "khaki", "camel", "mountain", "minimalist", "compass"],
    stock: 100,
    variants: ["S", "M", "L", "XL", "XXL"].map((s) => ({
      size: s,
      color: "Khaki",
      sku: `VIA-TEE-MTN-KHAKI-${s}`,
      price: 599,
      stock: 20,
    })),
  });
  await mountain.save();
  console.log(`✅ Created: ${mountain.name}`);
} else {
  console.log(`⚠️  Mountain Tee already exists — skipping`);
}

// ── Final count
const total = await Product.countDocuments();
console.log(`\n🎉 Done! Total products in DB: ${total}`);
console.log("\n📸 Upload images via Admin Panel → Products → Edit each product");

await mongoose.disconnect();
process.exit(0);
