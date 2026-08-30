import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";
import Coupon from "../models/Coupon.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { connectDB } from "../config/db.js";

export const SEED_CATEGORIES = [
  {
    name: "T-Shirts",
    slug: "t-shirts",
    description: "240-260 GSM Heavyweight combed cotton tees with drop-shoulder streetwear silhouettes.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
  {
    name: "Hoodies & Sweatshirts",
    slug: "hoodies-sweatshirts",
    description: "400-420 GSM French Terry and loopback cotton architectural outerwear.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
  {
    name: "Bottles",
    slug: "bottles",
    description: "Grade 304 double-wall vacuum insulated flasks and sports bottles with 360° custom print & laser etching.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
  {
    name: "Mugs",
    slug: "mugs",
    description: "Stoneware ceramic coffee mugs, travel tumblers with slider lids, and HD panoramic sublimation print mugs.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
  {
    name: "Caps & Headwear",
    slug: "caps-headwear",
    description: "Vintage distressed washed dad caps, 3D puff embroidered snapbacks, and tactical cotton bucket hats.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
  {
    name: "Custom Print",
    slug: "custom-print",
    description: "Customizable base merchandise: create your own tees, hoodies, mugs, bottles, and caps in live visual studio.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    description: "Heavy ripstop cargo pants and 380 GSM relaxed straight sweatpants.",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    active: true,
  },
];

export const SEED_COLLECTIONS = [
  {
    name: "Essentials",
    slug: "essentials",
    description: "Timeless core silhouettes engineered for everyday luxury rotation.",
    banner: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85",
    active: true,
  },
  {
    name: "Street",
    slug: "street",
    description: "Bold graphics, tactile puff prints, and utilitarian modular garments.",
    banner: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=85",
    active: true,
  },
  {
    name: "Oversized",
    slug: "oversized",
    description: "Exaggerated boxy cuts with structured drapes and wide-sleeve tailoring.",
    banner: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1600&q=85",
    active: true,
  },
  {
    name: "New Drop",
    slug: "new-drop",
    description: "Latest Autumn / Winter 2026 limited capsule releases.",
    banner: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=85",
    active: true,
  },
];

export const SEED_PRODUCTS = [
  // --- T-SHIRTS ---
  {
    name: "VIA Essential Oversized Tee",
    slug: "via-essential-oversized-tee",
    category: "T-Shirts",
    collection: "Essentials",
    price: 1299,
    compareAtPrice: 1999,
    discount: "35% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-TEE-001",
    gsm: "240 GSM Super Combed Cotton",
    fit: "Relaxed Boxy Drop-Shoulder Fit",
    material: "100% Super Combed Bio-Washed Cotton",
    shortDescription: "Engineered for everyday durability and effortless streetwear silhouette.",
    description:
      "Engineered for everyday durability and effortless streetwear silhouette. Made from ultra-dense 240 GSM 100% combed cotton, finished with our signature raw silicone wash for an ultra-soft hand feel and ribbed high neck collar.",
    specs: [
      "100% Super Combed Bio-Washed Cotton",
      "240 GSM Heavyweight Fabric",
      "Pre-shrunk to prevent shrinkage after wash",
      "Reinforced double-stitched ribbed collar",
      "High-density matte VIA micro-print on nape",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pitch Black"],
    variants: [
      { size: "S", color: "Pitch Black", sku: "VIA-TEE-001-S", price: 1299, stock: 25 },
      { size: "M", color: "Pitch Black", sku: "VIA-TEE-001-M", price: 1299, stock: 40 },
      { size: "L", color: "Pitch Black", sku: "VIA-TEE-001-L", price: 1299, stock: 35 },
      { size: "XL", color: "Pitch Black", sku: "VIA-TEE-001-XL", price: 1299, stock: 20 },
      { size: "XXL", color: "Pitch Black", sku: "VIA-TEE-001-XXL", price: 1299, stock: 15 },
    ],
    images: [
      "/assets/via-tee-real.jpg",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["heavyweight", "oversized", "cotton", "black", "tshirt"],
    ratings: 4.9,
    numReviews: 14,
  },
  {
    name: "VIA Eagle Crown Heavyweight Tee",
    slug: "via-eagle-crown-heavy-tee",
    category: "T-Shirts",
    collection: "New Drop",
    price: 1499,
    compareAtPrice: 2299,
    discount: "35% OFF",
    featured: true,
    newArrival: true,
    bestseller: false,
    sku: "VIA-TEE-002",
    gsm: "260 GSM Premium Combed Cotton",
    fit: "Oversized Street Silhouette",
    material: "100% Ring-Spun Cotton",
    shortDescription: "Iconic VIA Eagle Crest motif screen-printed with archival high-density discharge ink.",
    description:
      "Featuring the iconic VIA Eagle Crest motif screen-printed with archival high-density discharge ink. Built from heavyweight 260 GSM cotton that drapes naturally without clinging.",
    specs: [
      "260 GSM Heavyweight Single Jersey",
      "High-Density Screen Print on Back & Subtle Chest Crest",
      "Vintage Acid Wash Treatment",
      "Seamless tubular body construction",
      "Drop-shoulder aesthetic",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Washed Charcoal"],
    variants: [
      { size: "S", color: "Washed Charcoal", sku: "VIA-TEE-002-S", price: 1499, stock: 15 },
      { size: "M", color: "Washed Charcoal", sku: "VIA-TEE-002-M", price: 1499, stock: 25 },
      { size: "L", color: "Washed Charcoal", sku: "VIA-TEE-002-L", price: 1499, stock: 20 },
      { size: "XL", color: "Washed Charcoal", sku: "VIA-TEE-002-XL", price: 1499, stock: 15 },
      { size: "XXL", color: "Washed Charcoal", sku: "VIA-TEE-002-XXL", price: 1499, stock: 10 },
    ],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["eagle", "graphic", "acid-wash", "oversized", "tshirt"],
    ratings: 5.0,
    numReviews: 9,
  },

  // --- HOODIES & SWEATSHIRTS ---
  {
    name: "VIA Shadow French Terry Hoodie",
    slug: "via-shadow-french-terry-hoodie",
    category: "Hoodies & Sweatshirts",
    collection: "Essentials",
    price: 2499,
    compareAtPrice: 3499,
    discount: "28% OFF",
    featured: true,
    newArrival: false,
    bestseller: true,
    sku: "VIA-HD-001",
    gsm: "400 GSM 100% French Terry",
    fit: "Boxy Heavyweight Drop-Shoulder",
    material: "100% Heavy French Terry Cotton",
    shortDescription: "The pinnacle of luxury streetwear outerwear with double-layered crossover hood.",
    description:
      "The pinnacle of luxury streetwear outerwear. Crafted from dense 400 GSM French Terry loops for maximum warmth, structured drape, and unmatched comfort. Finished with a double-layered crossover hood with no drawstrings for a sleek minimalist look.",
    specs: [
      "400 GSM 100% Heavy French Terry Cotton",
      "Double layered architectural hood",
      "Thick 2x2 ribbed cuffs and waistband",
      "Hidden side-seam pockets instead of front pouch for a clean front profile",
      "Embossed tonal VIA crest embroidery on chest",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Obsidian Black"],
    variants: [
      { size: "S", color: "Obsidian Black", sku: "VIA-HD-001-S", price: 2499, stock: 12 },
      { size: "M", color: "Obsidian Black", sku: "VIA-HD-001-M", price: 2499, stock: 20 },
      { size: "L", color: "Obsidian Black", sku: "VIA-HD-001-L", price: 2499, stock: 18 },
      { size: "XL", color: "Obsidian Black", sku: "VIA-HD-001-XL", price: 2499, stock: 10 },
      { size: "XXL", color: "Obsidian Black", sku: "VIA-HD-001-XXL", price: 2499, stock: 8 },
    ],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["french-terry", "hoodie", "heavyweight", "black"],
    ratings: 4.9,
    numReviews: 21,
  },
  {
    name: "VIA Monolith Crewneck Sweatshirt",
    slug: "via-monolith-crewneck-sweatshirt",
    category: "Hoodies & Sweatshirts",
    collection: "Oversized",
    price: 2099,
    compareAtPrice: 2999,
    discount: "30% OFF",
    featured: false,
    newArrival: true,
    bestseller: false,
    sku: "VIA-SW-001",
    gsm: "360 GSM Heavyweight Terry",
    fit: "Boxy Drop-Shoulder Relaxed",
    material: "360 GSM Heavy Combed Cotton Terry",
    shortDescription: "Structured silhouette with thick ribbed neckband and drop-shoulder sleeve tailoring.",
    description:
      "A refined luxury staple. Features a structured silhouette with thick ribbed neckband and drop-shoulder sleeve tailoring, rendered in an understated raw bone tone.",
    specs: [
      "360 GSM Heavy Combed Cotton Terry",
      "Thick 1.25-inch ribbed crewneck collar",
      "Clean drop shoulders with locked overlock stitching",
      "Subtle monochrome rubberized VIA crest on wrist",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Bone Off-White"],
    variants: [
      { size: "S", color: "Bone Off-White", sku: "VIA-SW-001-S", price: 2099, stock: 10 },
      { size: "M", color: "Bone Off-White", sku: "VIA-SW-001-M", price: 2099, stock: 18 },
      { size: "L", color: "Bone Off-White", sku: "VIA-SW-001-L", price: 2099, stock: 15 },
      { size: "XL", color: "Bone Off-White", sku: "VIA-SW-001-XL", price: 2099, stock: 10 },
      { size: "XXL", color: "Bone Off-White", sku: "VIA-SW-001-XXL", price: 2099, stock: 5 },
    ],
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["crewneck", "sweatshirt", "heavyweight", "bone"],
    ratings: 4.7,
    numReviews: 8,
  },

  // --- BOTTLES ---
  {
    name: "VIA Thermal Vacuum Insulated Flask Bottle (750ml)",
    slug: "via-thermal-vacuum-flask-bottle",
    category: "Bottles",
    collection: "Essentials",
    price: 1299,
    compareAtPrice: 1899,
    discount: "32% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-BTL-001",
    gsm: "Double-Wall Grade 304 Stainless Steel",
    fit: "Ergonomic Grip with Leakproof Seal",
    material: "Food Grade 304 Stainless Steel",
    shortDescription: "Keeps beverages cold for 24h or hot for 12h with double-wall copper vacuum insulation.",
    description:
      "Engineered for daily resilience and thermal performance. Keeps beverages ice cold for 24 hours or steaming hot for 12 hours. Finished in our signature tactile ultra-matte powder coating with laser-engraved VIA identity crest.",
    specs: [
      "750ml Capacity • Grade 304 Food-Grade Stainless Steel",
      "Double-wall vacuum insulation with copper lining",
      "100% Sweat-proof & leak-proof silicone gasket cap",
      "BPA-Free, toxin-free, zero metallic aftertaste",
      "Custom laser-engraved or high-density UV print ready",
    ],
    sizes: ["750ml", "1000ml"],
    colors: ["Matte Pitch Black"],
    variants: [
      { size: "750ml", color: "Matte Pitch Black", sku: "VIA-BTL-001-750", price: 1299, stock: 35 },
      { size: "1000ml", color: "Matte Pitch Black", sku: "VIA-BTL-001-1000", price: 1499, stock: 25 },
    ],
    images: [
      "/assets/via-bottle-real.jpg",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1570572858053-48598910b809?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["bottle", "flask", "insulated", "stainless", "customizable"],
    ratings: 4.9,
    numReviews: 18,
  },
  {
    name: "VIA Tactical Carabiner Sports Bottle (1000ml)",
    slug: "via-tactical-carabiner-bottle",
    category: "Bottles",
    collection: "Street",
    price: 999,
    compareAtPrice: 1499,
    discount: "33% OFF",
    featured: false,
    newArrival: true,
    bestseller: false,
    sku: "VIA-BTL-002",
    gsm: "Single-Wall Lightweight Anodized Alloy",
    fit: "Wide Mouth with Utility Clip",
    material: "Matte Anodized Aluminum Alloy",
    shortDescription: "Rugged utilitarian bottle with alloy carabiner clip and high-flow sports nozzle.",
    description:
      "A rugged utilitarian companion for urban exploration and gym sessions. Comes equipped with a heavy-duty carabiner clip and high-flow sports nozzle.",
    specs: [
      "1000ml High Volume Capacity",
      "Heavy-duty matte black anodized aluminum",
      "Tactical alloy carabiner clip for backpack attachment",
      "Scratch-resistant textured grip",
    ],
    sizes: ["1000ml"],
    colors: ["Stealth Gunmetal"],
    variants: [
      { size: "1000ml", color: "Stealth Gunmetal", sku: "VIA-BTL-002-1000", price: 999, stock: 30 },
    ],
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["bottle", "sports", "tactical", "carabiner"],
    ratings: 4.6,
    numReviews: 7,
  },
  {
    name: "VIA Custom Print Hydro Shield Steel Bottle",
    slug: "via-custom-print-hydro-bottle",
    category: "Custom Print",
    collection: "New Drop",
    price: 1499,
    compareAtPrice: 2199,
    discount: "32% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-BTL-CUST",
    gsm: "Customizable 304 Stainless Steel",
    fit: "Full 360° Custom Print or Laser Engrave",
    material: "Grade 304 Vacuum Stainless Steel",
    shortDescription: "Custom print or laser engrave your logo, artwork, and name with 360° UV printing.",
    description:
      "Customize with your own high-resolution artwork, company logo, monogram, or custom typography. Precision 360° UV cylindrical printing or crisp fiber laser etching that never fades or peels.",
    specs: [
      "Custom Graphic / Logo / Text placement",
      "High-definition 360° UV rotary print or precision laser etch",
      "Thermal insulation: 24h Cold / 12h Hot",
      "Dishwasher safe & scratch resistant",
    ],
    sizes: ["750ml", "1000ml"],
    colors: ["Matte Black", "Bone White"],
    variants: [
      { size: "750ml", color: "Matte Black", sku: "VIA-BTL-CUST-750", price: 1499, stock: 50 },
      { size: "1000ml", color: "Matte Black", sku: "VIA-BTL-CUST-1000", price: 1699, stock: 40 },
    ],
    images: [
      "/assets/via-bottle-real.jpg",
      "https://images.unsplash.com/photo-1570572858053-48598910b809?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["custom", "bottle", "laser-engrave", "uv-print"],
    ratings: 5.0,
    numReviews: 24,
  },

  // --- MUGS ---
  {
    name: "VIA Cyberpunk Matte Ceramic Mug (350ml)",
    slug: "via-cyberpunk-matte-ceramic-mug",
    category: "Mugs",
    collection: "Essentials",
    price: 499,
    compareAtPrice: 799,
    discount: "37% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-MUG-001",
    gsm: "Heavyweight Stoneware Ceramic",
    fit: "Comfort-Grip Ergonomic Handle",
    material: "Kiln-Fired Stoneware Ceramic",
    shortDescription: "Dense stoneware ceramic with tactile satin-matte exterior and heat retention rim.",
    description:
      "High-density kiln-fired ceramic mug with a smooth satin-matte exterior and glossy interior. Built with thick walls to retain coffee heat longer, featuring the subtle tonal VIA emblem.",
    specs: [
      "350ml (12 oz) Ideal Coffee & Tea Volume",
      "Premium heavyweight stoneware ceramic",
      "Microwave and dishwasher safe",
      "Heat-insulating thick rim construction",
    ],
    sizes: ["350ml"],
    colors: ["Obsidian Matte"],
    variants: [
      { size: "350ml", color: "Obsidian Matte", sku: "VIA-MUG-001-350", price: 499, stock: 45 },
    ],
    images: [
      "/assets/via-mug-real.jpg",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["mug", "coffee", "ceramic", "matte", "black"],
    ratings: 4.8,
    numReviews: 12,
  },
  {
    name: "VIA Stealth Insulated Coffee Tumbler (400ml)",
    slug: "via-stealth-insulated-coffee-tumbler",
    category: "Mugs",
    collection: "Street",
    price: 899,
    compareAtPrice: 1399,
    discount: "35% OFF",
    featured: false,
    newArrival: true,
    bestseller: false,
    sku: "VIA-MUG-002",
    gsm: "Double-Wall Insulated Steel with Slider Lid",
    fit: "Desk & Car Cup-Holder Friendly",
    material: "Stainless Steel & Tritan Lid",
    shortDescription: "Spill-resistant travel tumbler mug with magnetic slider lid and 6h heat retention.",
    description:
      "A modern spill-resistant travel mug engineered with vacuum insulation and a splash-proof magnetic slider lid. Keeps espresso and brews hot for 6+ hours.",
    specs: [
      "400ml Volume with Tritan crystal-clear slider lid",
      "Double-walled vacuum temperature retention",
      "Condensation-proof matte powder coat finish",
      "Non-slip silicone base pad",
    ],
    sizes: ["400ml"],
    colors: ["Charcoal Grey"],
    variants: [
      { size: "400ml", color: "Charcoal Grey", sku: "VIA-MUG-002-400", price: 899, stock: 35 },
    ],
    images: [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["tumbler", "travel-mug", "coffee", "insulated"],
    ratings: 4.9,
    numReviews: 16,
  },
  {
    name: "VIA Custom Print Signature Ceramic Mug",
    slug: "via-custom-print-signature-mug",
    category: "Custom Print",
    collection: "New Drop",
    price: 599,
    compareAtPrice: 899,
    discount: "33% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-MUG-CUST",
    gsm: "Kiln-Fired Ceramic Sublimation Ready",
    fit: "Full Panoramic Wrap Print",
    material: "Ceramic with Sublimation Polymer Glaze",
    shortDescription: "Personalize with full-color panoramic photo or custom graphic printing.",
    description:
      "Bring your personal brand, custom illustrations, memorable quotes, or street graphics to life with vibrant, ultra-high-definition panoramic sublimation printing.",
    specs: [
      "Full wrap custom design & typography printing",
      "Ultra HD sublimation ink technology with vivid color reproduction",
      "100% Dishwasher and microwave safe",
      "Scratch and chip resistant glaze",
    ],
    sizes: ["350ml", "450ml"],
    colors: ["Pitch Black", "Gloss White"],
    variants: [
      { size: "350ml", color: "Pitch Black", sku: "VIA-MUG-CUST-350", price: 599, stock: 60 },
      { size: "450ml", color: "Pitch Black", sku: "VIA-MUG-CUST-450", price: 699, stock: 40 },
    ],
    images: [
      "/assets/via-mug-real.jpg",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["custom-mug", "photo-mug", "gift", "sublimation"],
    ratings: 4.9,
    numReviews: 31,
  },

  // --- CAPS & HEADWEAR ---
  {
    name: "VIA Archival Distressed Washed Dad Cap",
    slug: "via-archival-distressed-dad-cap",
    category: "Caps & Headwear",
    collection: "Essentials",
    price: 799,
    compareAtPrice: 1199,
    discount: "33% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-CAP-001",
    gsm: "100% Heavy Washed Cotton Twill",
    fit: "Unstructured 6-Panel Low Profile",
    material: "100% Heavy Washed Cotton Twill",
    shortDescription: "Vintage enzyme washed dad hat with brass slider buckle and tonal crest embroidery.",
    description:
      "Crafted from premium heavy cotton twill with an enzyme vintage wash and micro-distressed edges. Features subtle tonal 3D embroidery and an antique brass strap buckle.",
    specs: [
      "100% Heavy Bio-Washed Cotton Twill",
      "Unstructured crown for relaxed authentic street silhouette",
      "Embossed antique brass slider buckle back closure",
      "Curved visor with pre-curved shape memory",
      "Internal moisture-wicking sweatband",
    ],
    sizes: ["Free Size (Adjustable)"],
    colors: ["Washed Charcoal"],
    variants: [
      { size: "Free Size (Adjustable)", color: "Washed Charcoal", sku: "VIA-CAP-001-FS", price: 799, stock: 30 },
    ],
    images: [
      "/assets/via-cap-real.jpg",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["cap", "dad-hat", "distressed", "washed", "headwear"],
    ratings: 4.8,
    numReviews: 15,
  },
  {
    name: "VIA 3D Monogram Structured Snapback Cap",
    slug: "via-3d-monogram-structured-snapback",
    category: "Caps & Headwear",
    collection: "Street",
    price: 999,
    compareAtPrice: 1499,
    discount: "33% OFF",
    featured: true,
    newArrival: false,
    bestseller: true,
    sku: "VIA-CAP-002",
    gsm: "Structured Acrylic Wool Blend",
    fit: "High-Profile 6-Panel Flat Brim",
    material: "Wool Acrylic Structured Blend",
    shortDescription: "High-profile flat brim snapback with high-density 3D puff embroidery.",
    description:
      "A classic streetwear staple featuring dense 3D high-density puff embroidery on the front panels and structured buckram crown that maintains sharp architectural lines.",
    specs: [
      "High-density 3D puff embroidery front logo",
      "Reinforced structured buckram front panels",
      "Classic flat brim with green underside retro contrast",
      "Adjustable 7-hole snapback closure for universal fit",
    ],
    sizes: ["Free Size (Adjustable)"],
    colors: ["Pitch Black"],
    variants: [
      { size: "Free Size (Adjustable)", color: "Pitch Black", sku: "VIA-CAP-002-FS", price: 999, stock: 25 },
    ],
    images: [
      "/assets/via-cap-real.jpg",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["snapback", "3d-embroidery", "cap", "streetwear"],
    ratings: 5.0,
    numReviews: 22,
  },
  {
    name: "VIA Tactical Heavy Cotton Street Bucket Hat",
    slug: "via-tactical-heavy-bucket-hat",
    category: "Caps & Headwear",
    collection: "Street",
    price: 899,
    compareAtPrice: 1299,
    discount: "30% OFF",
    featured: false,
    newArrival: true,
    bestseller: false,
    sku: "VIA-CAP-003",
    gsm: "300 GSM Heavyweight Cotton Ripstop",
    fit: "Relaxed Brim Streetwear Cut",
    material: "300 GSM Heavy Ripstop Cotton",
    shortDescription: "Heavy cotton ripstop bucket hat with ventilation eyelets and tonal crest.",
    description:
      "Built for festival season and sunny city streets with durable heavy cotton ripstop, embroidered ventilation eyelets, and tonal VIA brand patch.",
    specs: [
      "300 GSM Cotton Ripstop Fabric",
      "Reinforced downward-sloping brim with multi-stitch rows",
      "Breathable metal ventilation eyelets",
      "Lightweight packable construction",
    ],
    sizes: ["M/L", "L/XL"],
    colors: ["Obsidian Black"],
    variants: [
      { size: "M/L", color: "Obsidian Black", sku: "VIA-CAP-003-ML", price: 899, stock: 20 },
      { size: "L/XL", color: "Obsidian Black", sku: "VIA-CAP-003-LXL", price: 899, stock: 15 },
    ],
    images: [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["bucket-hat", "ripstop", "streetwear", "cap"],
    ratings: 4.7,
    numReviews: 11,
  },
  {
    name: "VIA Custom Print & 3D Embroidered Cap",
    slug: "via-custom-print-embroidered-cap",
    category: "Custom Print",
    collection: "New Drop",
    price: 1099,
    compareAtPrice: 1699,
    discount: "35% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-CAP-CUST",
    gsm: "Customizable 6-Panel Twill / Snapback",
    fit: "Custom Front & Side Embroidery / Print",
    material: "Heavyweight Cotton Twill",
    shortDescription: "Custom 3D puff embroidery or full-color heat transfer on front and side panels.",
    description:
      "Design your personal cap with custom 3D puff embroidery, flat stitching, or laser-cut heat transfer prints. Premium quality finish designed for personal wear or brand drops.",
    specs: [
      "Custom 3D Puff Embroidery or Full-Color Transfer",
      "Front crown, side panel, and back arch custom placements",
      "Heavyweight cotton twill construction",
      "Universal adjustable strap closure",
    ],
    sizes: ["Free Size (Adjustable)"],
    colors: ["Pitch Black", "Vintage Khaki"],
    variants: [
      { size: "Free Size (Adjustable)", color: "Pitch Black", sku: "VIA-CAP-CUST-FS", price: 1099, stock: 50 },
    ],
    images: [
      "/assets/via-cap-real.jpg",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["custom-cap", "embroidery", "headwear", "custom"],
    ratings: 4.9,
    numReviews: 19,
  },

  // --- CUSTOM PRINT APPAREL ---
  {
    name: "VIA Custom Print 240 GSM Oversized Tee",
    slug: "via-custom-print-oversized-tee",
    category: "Custom Print",
    collection: "Essentials",
    price: 1399,
    compareAtPrice: 1999,
    discount: "30% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-TEE-CUST",
    gsm: "240 GSM Super Combed Cotton",
    fit: "Relaxed Boxy Drop-Shoulder",
    material: "100% Bio-Washed Combed Cotton",
    shortDescription: "Your artwork printed in photorealistic DTG on our flagship 240 GSM heavyweight tee.",
    description:
      "Your canvas on our signature 240 GSM luxury heavyweight tee. Add your artwork on front chest, full back, or sleeves using ultra-fine Direct-to-Garment (DTG) or high-density screen printing.",
    specs: [
      "240 GSM Super Combed Bio-Washed Cotton",
      "Photorealistic DTG or Screen Print technology",
      "Wash-tested up to 50+ cycles with zero fading or cracking",
      "Relaxed streetwear drop-shoulder fit",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pitch Black", "Bone White"],
    variants: [
      { size: "S", color: "Pitch Black", sku: "VIA-TEE-CUST-S", price: 1399, stock: 20 },
      { size: "M", color: "Pitch Black", sku: "VIA-TEE-CUST-M", price: 1399, stock: 35 },
      { size: "L", color: "Pitch Black", sku: "VIA-TEE-CUST-L", price: 1399, stock: 30 },
      { size: "XL", color: "Pitch Black", sku: "VIA-TEE-CUST-XL", price: 1399, stock: 20 },
      { size: "XXL", color: "Pitch Black", sku: "VIA-TEE-CUST-XXL", price: 1399, stock: 15 },
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["custom-tee", "dtg-print", "oversized", "heavyweight"],
    ratings: 5.0,
    numReviews: 28,
  },
  {
    name: "VIA Custom Print 400 GSM French Terry Hoodie",
    slug: "via-custom-print-french-terry-hoodie",
    category: "Custom Print",
    collection: "Street",
    price: 2699,
    compareAtPrice: 3899,
    discount: "30% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-HD-CUST",
    gsm: "400 GSM 100% French Terry",
    fit: "Boxy Heavyweight Drop-Shoulder",
    material: "100% Heavy French Terry Cotton",
    shortDescription: "Custom chest crest or back discharge print on ultra-dense 400 GSM French Terry.",
    description:
      "Heavyweight 400 GSM French Terry hoodie customized with your custom chest crest, bold back print, or sleeve typography. Built for luxury warmth and lasting streetwear impact.",
    specs: [
      "400 GSM Unbrushed Heavyweight French Terry",
      "High-density discharge print or 3D puff embroidery",
      "Double layered architectural hood",
      "Hidden side-seam pockets for sleek printing area",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Obsidian Black"],
    variants: [
      { size: "S", color: "Obsidian Black", sku: "VIA-HD-CUST-S", price: 2699, stock: 15 },
      { size: "M", color: "Obsidian Black", sku: "VIA-HD-CUST-M", price: 2699, stock: 25 },
      { size: "L", color: "Obsidian Black", sku: "VIA-HD-CUST-L", price: 2699, stock: 20 },
      { size: "XL", color: "Obsidian Black", sku: "VIA-HD-CUST-XL", price: 2699, stock: 10 },
      { size: "XXL", color: "Obsidian Black", sku: "VIA-HD-CUST-XXL", price: 2699, stock: 5 },
    ],
    images: [
      "/assets/via-hoodie-real.jpg",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
    ],
    ratings: 4.9,
    numReviews: 14,
  },

  // --- BOTTOMS ---
  {
    name: "VIA Tactical Modular Cargo Pants",
    slug: "via-tactical-modular-cargo",
    category: "Bottoms",
    collection: "Street",
    price: 2199,
    compareAtPrice: 3199,
    discount: "31% OFF",
    featured: true,
    newArrival: true,
    bestseller: true,
    sku: "VIA-CG-001",
    gsm: "300 GSM Heavyweight Cotton Twill",
    fit: "Wide-Leg Baggy with Ankle Cinch Bungees",
    material: "300 GSM Cotton Ripstop Twill",
    shortDescription: "Engineered utilitarian cargo trousers with 6 pockets and adjustable hem bungee toggles.",
    description:
      "Engineered utilitarian cargo trousers constructed from heavy 300 GSM cotton ripstop twill. Fitted with 6 utility pockets, deep gussets, and adjustable bungee toggles at the hems for customizable tapered or wide drape.",
    specs: [
      "Heavy 300 GSM Cotton Ripstop Twill",
      "6 Deep ergonomic functional pockets",
      "Elasticated waistband with metal-tipped drawcord",
      "Adjustable hem bungee cord toggles",
      "Reinforced knee articulation panels",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Matte Black"],
    variants: [
      { size: "S", color: "Matte Black", sku: "VIA-CG-001-S", price: 2199, stock: 10 },
      { size: "M", color: "Matte Black", sku: "VIA-CG-001-M", price: 2199, stock: 14 },
      { size: "L", color: "Matte Black", sku: "VIA-CG-001-L", price: 2199, stock: 10 },
      { size: "XL", color: "Matte Black", sku: "VIA-CG-001-XL", price: 2199, stock: 7 },
      { size: "XXL", color: "Matte Black", sku: "VIA-CG-001-XXL", price: 2199, stock: 3 },
    ],
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85",
    ],
    tags: ["cargo", "tactical", "pants", "bottoms", "black"],
    ratings: 4.8,
    numReviews: 11,
  },
];

export const SEED_COUPONS = [
  {
    code: "VIA10",
    type: "percentage",
    value: 10,
    minimumOrderValue: 999,
    maximumDiscount: 500,
    usageLimit: 1000,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    active: true,
  },
  {
    code: "FIRSTDROP",
    type: "percentage",
    value: 15,
    minimumOrderValue: 1999,
    maximumDiscount: 750,
    usageLimit: 500,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    active: true,
  },
  {
    code: "VIP500",
    type: "fixed",
    value: 500,
    minimumOrderValue: 2999,
    usageLimit: 200,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    active: true,
  },
];

export const seedDatabase = async () => {
  try {
    console.log("[Seeder] Clearing old collections...");
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Collection.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    console.log("[Seeder] Creating Admin & Customer accounts...");
    const adminUser = await User.create({
      name: "Vivek Awasthi",
      email: "admin@viaclothing.in",
      password: "Admin@VIA2026",
      phone: "917007470175",
      role: "admin",
      addresses: [
        {
          fullName: "Vivek Awasthi",
          phone: "917007470175",
          addressLine1: "VIA Streetwear Studio",
          addressLine2: "100 Feet Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          country: "India",
          isDefault: true,
        },
      ],
    });

    const customerUser = await User.create({
      name: "Aryan Sharma",
      email: "customer@viaclothing.in",
      password: "Customer@VIA2026",
      phone: "919876543210",
      role: "customer",
      addresses: [
        {
          fullName: "Aryan Sharma",
          phone: "919876543210",
          addressLine1: "Tower 4, Apt 1102, Cyber Heights",
          addressLine2: "DLF Phase 5",
          city: "Gurugram",
          state: "Haryana",
          postalCode: "122002",
          country: "India",
          isDefault: true,
        },
      ],
    });

    console.log("[Seeder] Inserting Categories & Collections...");
    await Category.insertMany(SEED_CATEGORIES);
    await Collection.insertMany(SEED_COLLECTIONS);

    console.log("[Seeder] Inserting Products...");
    const createdProducts = await Product.insertMany(SEED_PRODUCTS);

    console.log("[Seeder] Inserting Coupons...");
    await Coupon.insertMany(SEED_COUPONS);

    console.log("[Seeder] Creating Sample Verified Reviews & Initial Order...");
    const sampleProduct = createdProducts[0];
    await Review.create({
      user: customerUser._id,
      userName: customerUser.name,
      product: sampleProduct._id,
      rating: 5,
      title: "Insane quality. The 240 GSM weight is real.",
      comment:
        "The fit is properly boxy with wide drop-shoulders. You can feel the density immediately. Collar stays firm after multiple washes. Truly premium streetwear.",
      verifiedPurchase: true,
      approved: true,
    });

    // Sample historical order for demonstration
    await Order.create({
      user: customerUser._id,
      orderNumber: "VIA-2026-849201",
      items: [
        {
          product: sampleProduct._id,
          name: sampleProduct.name,
          image: sampleProduct.images[0],
          price: sampleProduct.price,
          size: "L",
          color: "Pitch Black",
          sku: "VIA-TEE-001-L",
          quantity: 1,
        },
      ],
      shippingAddress: customerUser.addresses[0],
      subtotal: 1299,
      discount: 0,
      shippingFee: 150,
      total: 1449,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: "order_demo_101",
      razorpayPaymentId: "pay_demo_202",
      razorpaySignature: "demo_sig_verified",
      orderStatus: "delivered",
      trackingNumber: "BD992838192IN",
      carrier: "BlueDart Express",
      timeline: [
        { status: "confirmed", timestamp: new Date(Date.now() - 5 * 86400000), note: "Order placed & paid." },
        { status: "shipped", timestamp: new Date(Date.now() - 3 * 86400000), note: "Dispatched via BlueDart." },
        { status: "delivered", timestamp: new Date(Date.now() - 1 * 86400000), note: "Delivered to recipient." },
      ],
    });

    console.log("[Seeder] Database successfully seeded with VIA data!");
    console.log("--------------------------------------------------");
    console.log("Admin Login:    admin@viaclothing.in  /  Admin@VIA2026");
    console.log("Customer Login: customer@viaclothing.in / Customer@VIA2026");
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("[Seeder] Error seeding database:", err);
  }
};

export const autoSeedIfEmpty = async () => {
  const categoryCount = await Category.countDocuments();
  const productCount = await Product.countDocuments();
  if (productCount < 10 || categoryCount < 5) {
    console.log("[Database] Incomplete or empty database detected. Seeding latest catalog...");
    await seedDatabase();
  }
};

// If run directly via `node utils/seedData.js`
if (process.argv[1]?.endsWith("seedData.js")) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
