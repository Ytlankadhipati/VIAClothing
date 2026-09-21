/**
 * VIA Real Product Seed Script
 * Uploads images to Cloudinary, then seeds products into MongoDB
 * Run: node backend/scripts/seedProducts.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./backend/.env" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "../../frontend/public/assets");

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Upload helper ───────────────────────────────────────────────────────────
async function uploadImage(filename, folder = "via-products") {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Image not found: ${filePath}`);
    return "";
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });
  console.log(`  ✅ Uploaded: ${filename} → ${result.secure_url}`);
  return result.secure_url;
}

// ── Connect DB ──────────────────────────────────────────────────────────────
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
}

// ── Product Schema (inline, matches models/Product.js) ─────────────────────
const variantSchema = new mongoose.Schema({
  size: String,
  color: { type: String, default: "Standard" },
  sku: String,
  price: Number,
  stock: { type: Number, default: 10 },
  image: { type: String, default: "" },
});

let Product;
try {
  Product = mongoose.model("Product");
} catch {
  const productSchema = new mongoose.Schema(
    {
      name: String,
      slug: { type: String, unique: true, lowercase: true },
      description: String,
      shortDescription: { type: String, default: "" },
      brand: { type: String, default: "VIA" },
      category: String,
      collection: String,
      price: Number,
      compareAtPrice: { type: Number, default: null },
      discount: { type: String, default: "" },
      sku: { type: String, unique: true, uppercase: true },
      images: [String],
      thumbnail: { type: String, default: "" },
      sizes: { type: [String], default: ["S", "M", "L", "XL", "XXL"] },
      colors: { type: [String], default: ["Black"] },
      variants: [variantSchema],
      stock: { type: Number, default: 50 },
      gsm: { type: String, default: "240 GSM Super Combed Cotton" },
      fit: { type: String, default: "Relaxed Boxy Drop-Shoulder Fit" },
      material: { type: String, default: "100% Super Combed Bio-Washed Cotton" },
      specs: { type: [String], default: [] },
      careInstructions: {
        type: [String],
        default: [
          "Machine wash cold inside out with like colors",
          "Do not bleach or dry clean",
          "Tumble dry low or hang dry in shade",
          "Iron inside-out on low heat (do not iron over prints)",
        ],
      },
      tags: { type: [String], default: [] },
      featured: { type: Boolean, default: false },
      bestseller: { type: Boolean, default: false },
      newArrival: { type: Boolean, default: false },
      limitedEdition: { type: Boolean, default: false },
      active: { type: Boolean, default: true },
      ratings: { type: Number, default: 5.0 },
      numReviews: { type: Number, default: 0 },
    },
    { timestamps: true, suppressReservedKeysWarning: true }
  );
  productSchema.pre("save", function (next) {
    if (!this.thumbnail && this.images && this.images.length > 0) {
      this.thumbnail = this.images[0];
    }
    next();
  });
  Product = mongoose.model("Product", productSchema);
}

// ── Main seed ───────────────────────────────────────────────────────────────
async function seed() {
  await connectDB();

  // Clear existing products
  await Product.deleteMany({});
  console.log("🗑️  Cleared all existing products");

  // Upload all images to Cloudinary first
  console.log("\n📤 Uploading images to Cloudinary...");
  const imgs = {
    viaTee:        await uploadImage("via-tee-real.jpg"),
    ownVision:     await uploadImage("hero-tshirt-1.jpg"),
    lastRace:      await uploadImage("hero-tshirt-2.jpg"),
    eagleCrest:    await uploadImage("hero-tshirt-3.jpg"),
    viaHoodie:     await uploadImage("via-hoodie-real.jpg"),
    viaCap:        await uploadImage("via-cap-real.jpg"),
    viaBottle:     await uploadImage("via-bottle-real.jpg"),
    viaMug:        await uploadImage("via-mug-real.jpg"),
  };

  const SALE  = 599;
  const MRP   = 999;
  const DISC  = "40% OFF";

  const TEE_SIZES   = ["S", "M", "L", "XL", "XXL"];
  const ACC_SIZES   = ["One Size"];

  const products = [
    // ── T-SHIRTS ────────────────────────────────────────────────────────
    {
      name: "VIA Signature Oversized Tee",
      slug: "via-signature-oversized-tee",
      shortDescription: "Bold VIA wordmark tee in heavyweight 240 GSM cotton.",
      description:
        "Make a statement before you say a word. The VIA Signature Tee features a bold block-letter 'VIA — Vibe Identity Authenticity' chest print on a drop-shoulder heavyweight silhouette. 240 GSM bio-washed cotton for a lived-in feel from day one.",
      category: "tshirt",
      collection: "Signature Series",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-TEE-SIG-BLK",
      images: [imgs.viaTee],
      thumbnail: imgs.viaTee,
      sizes: TEE_SIZES,
      colors: ["Black"],
      featured: true,
      bestseller: true,
      newArrival: false,
      tags: ["tshirt", "oversized", "black", "signature", "streetwear"],
      stock: 100,
      variants: TEE_SIZES.map((s, i) => ({
        size: s,
        color: "Black",
        sku: `VIA-TEE-SIG-BLK-${s}`,
        price: SALE,
        stock: 20,
      })),
    },
    {
      name: "Own The Vision Oversized Tee",
      slug: "own-the-vision-oversized-tee",
      shortDescription: "Angel wings graphic tee — 'Believe. Build. Become.'",
      description:
        "Carry your ambition on your back. The Own The Vision Tee features a dramatic angel-wings graphic with 'VIA • Own The Vision • Believe Build Become — ESTD. 2024' back print on a sand/khaki oversized silhouette. 240 GSM super combed cotton with exaggerated drop shoulders.",
      category: "tshirt",
      collection: "Capsule AW26",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-TEE-OTV-SAND",
      images: [imgs.ownVision],
      thumbnail: imgs.ownVision,
      sizes: TEE_SIZES,
      colors: ["Sand"],
      featured: true,
      bestseller: false,
      newArrival: true,
      limitedEdition: true,
      tags: ["tshirt", "oversized", "sand", "angel", "vision", "graphic"],
      stock: 100,
      variants: TEE_SIZES.map((s) => ({
        size: s,
        color: "Sand",
        sku: `VIA-TEE-OTV-SAND-${s}`,
        price: SALE,
        stock: 20,
      })),
    },
    {
      name: "Last Race Club Oversized Tee",
      slug: "last-race-club-oversized-tee",
      shortDescription: "Racing-inspired graphic tee in steel blue.",
      description:
        "For those who live life at full throttle. The Last Race Club Tee features a bold racing-car graphic with checkered flags on a steel-blue drop-shoulder silhouette. 240 GSM super combed cotton — made for the streets, not the stands.",
      category: "tshirt",
      collection: "Capsule AW26",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-TEE-LRC-BLUE",
      images: [imgs.lastRace],
      thumbnail: imgs.lastRace,
      sizes: TEE_SIZES,
      colors: ["Steel Blue"],
      featured: false,
      bestseller: false,
      newArrival: true,
      tags: ["tshirt", "oversized", "blue", "racing", "graphic", "club"],
      stock: 100,
      variants: TEE_SIZES.map((s) => ({
        size: s,
        color: "Steel Blue",
        sku: `VIA-TEE-LRC-BLUE-${s}`,
        price: SALE,
        stock: 20,
      })),
    },
    {
      name: "Eagle Crest Oversized Tee",
      slug: "eagle-crest-oversized-tee",
      shortDescription: "Eagle + crown crest graphic on rich chocolate brown.",
      description:
        "Wear the crest. The Eagle Crest Tee features a metallic VIA eagle crest with a crown — 'Vibe • Identity • Authenticity' — rendered on a chocolate brown drop-shoulder silhouette. 240 GSM super combed cotton, bio-washed for premium hand feel.",
      category: "tshirt",
      collection: "Signature Series",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-TEE-ECR-BRWN",
      images: [imgs.eagleCrest],
      thumbnail: imgs.eagleCrest,
      sizes: TEE_SIZES,
      colors: ["Chocolate Brown"],
      featured: true,
      bestseller: true,
      newArrival: false,
      tags: ["tshirt", "oversized", "brown", "eagle", "crest", "graphic"],
      stock: 100,
      variants: TEE_SIZES.map((s) => ({
        size: s,
        color: "Chocolate Brown",
        sku: `VIA-TEE-ECR-BRWN-${s}`,
        price: SALE,
        stock: 20,
      })),
    },

    // ── HOODIE ──────────────────────────────────────────────────────────
    {
      name: "VIA Classic Hoodie",
      slug: "via-classic-hoodie",
      shortDescription: "400 GSM French terry heavyweight hoodie — clean minimal.",
      description:
        "The essential VIA hoodie. Small embroidered VIA logo on the chest on a clean-black boxy French terry hoodie. 400 GSM heavyweight fleece with a structured kangaroo pocket and ribbed cuffs. Designed for all-day comfort with streetwear attitude.",
      category: "hoodie",
      collection: "Signature Series",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-HOOD-CLS-BLK",
      images: [imgs.viaHoodie],
      thumbnail: imgs.viaHoodie,
      sizes: TEE_SIZES,
      colors: ["Black"],
      gsm: "400 GSM French Terry Cotton",
      fit: "Relaxed Boxy Hoodie Fit",
      featured: true,
      bestseller: true,
      newArrival: false,
      tags: ["hoodie", "black", "heavyweight", "french terry", "classic"],
      stock: 80,
      variants: TEE_SIZES.map((s) => ({
        size: s,
        color: "Black",
        sku: `VIA-HOOD-CLS-BLK-${s}`,
        price: SALE,
        stock: 16,
      })),
    },

    // ── HEADWEAR ─────────────────────────────────────────────────────────
    {
      name: "VIA Washed Strapback Cap",
      slug: "via-washed-strapback-cap",
      shortDescription: "3D puff VIA logo on vintage-washed black strapback.",
      description:
        "Finish the fit. The VIA Washed Cap features a bold 3D puff embroidered 'VIA' logo on a vintage enzyme-washed black cotton twill. Adjustable metal strapback closure for a perfect fit. Low profile, structured front panel — pairs with every VIA drop.",
      category: "cap",
      collection: "Accessories",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-CAP-WSH-BLK",
      images: [imgs.viaCap],
      thumbnail: imgs.viaCap,
      sizes: ACC_SIZES,
      colors: ["Washed Black"],
      gsm: "Cotton Twill",
      fit: "One Size Adjustable Strapback",
      material: "100% Cotton Twill, Enzyme Washed",
      featured: false,
      bestseller: true,
      newArrival: true,
      tags: ["cap", "headwear", "black", "washed", "strapback", "embroidery"],
      stock: 60,
      variants: [
        {
          size: "One Size",
          color: "Washed Black",
          sku: "VIA-CAP-WSH-BLK-OS",
          price: SALE,
          stock: 60,
        },
      ],
    },

    // ── ACCESSORIES ───────────────────────────────────────────────────────
    {
      name: "VIA Vacuum Flask",
      slug: "via-vacuum-flask",
      shortDescription: "360° laser-engraved matte black stainless flask.",
      description:
        "Hydrate in style. The VIA Vacuum Flask features a laser-engraved VIA crest and 'Vibe Identity Authenticity' wrap text on a double-wall insulated matte black stainless steel body. Keeps drinks cold for 24 hours, hot for 12. Carry strap included.",
      category: "accessories",
      collection: "Accessories",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-BOTTLE-BLK",
      images: [imgs.viaBottle],
      thumbnail: imgs.viaBottle,
      sizes: ACC_SIZES,
      colors: ["Matte Black"],
      gsm: "Stainless Steel 18/8",
      fit: "500ml Double Wall Insulated",
      material: "Food-grade Stainless Steel 18/8, Powder Coated",
      specs: [
        "500ml capacity",
        "Double-wall vacuum insulation",
        "Cold: 24 hrs | Hot: 12 hrs",
        "360° laser engraved VIA branding",
        "BPA-free carry strap",
        "Leak-proof twist cap",
      ],
      careInstructions: [
        "Hand wash only — do not dishwash",
        "Do not microwave",
        "Clean with mild soap and warm water",
      ],
      featured: false,
      bestseller: false,
      newArrival: true,
      tags: ["bottle", "flask", "accessories", "black", "matte", "steel"],
      stock: 50,
      variants: [
        {
          size: "One Size",
          color: "Matte Black",
          sku: "VIA-BOTTLE-BLK-OS",
          price: SALE,
          stock: 50,
        },
      ],
    },
    {
      name: "VIA Ceramic Mug",
      slug: "via-ceramic-mug",
      shortDescription: "Matte black kiln-fired ceramic mug with VIA print.",
      description:
        "Your morning ritual, elevated. The VIA Ceramic Mug features a bold 'VIA — Vibe Identity Authenticity' sublimation print on a kiln-fired matte black ceramic body. Microwave and dishwasher safe. 350ml capacity. The perfect desk statement piece.",
      category: "accessories",
      collection: "Accessories",
      price: SALE,
      compareAtPrice: MRP,
      discount: DISC,
      sku: "VIA-MUG-BLK",
      images: [imgs.viaMug],
      thumbnail: imgs.viaMug,
      sizes: ACC_SIZES,
      colors: ["Matte Black"],
      gsm: "Ceramic",
      fit: "350ml Standard Handle",
      material: "Kiln-fired Ceramic, Matte Finish",
      specs: [
        "350ml capacity",
        "Microwave safe",
        "Dishwasher safe",
        "High-definition VIA sublimation print",
        "Scratch-resistant matte glaze",
      ],
      careInstructions: [
        "Dishwasher safe — top rack preferred",
        "Microwave safe",
        "Avoid abrasive scrubbers to protect print",
      ],
      featured: false,
      bestseller: false,
      newArrival: true,
      tags: ["mug", "ceramic", "accessories", "black", "coffee"],
      stock: 50,
      variants: [
        {
          size: "One Size",
          color: "Matte Black",
          sku: "VIA-MUG-BLK-OS",
          price: SALE,
          stock: 50,
        },
      ],
    },
  ];

  console.log(`\n🌱 Seeding ${products.length} products into MongoDB...`);
  for (const data of products) {
    const product = new Product(data);
    await product.save();
    console.log(`  ✅ ${data.name} (₹${data.price} / MRP ₹${data.compareAtPrice})`);
  }

  console.log("\n🎉 All products seeded successfully!\n");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
