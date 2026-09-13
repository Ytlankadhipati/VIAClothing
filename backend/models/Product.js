import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, default: "Standard" },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 10, min: 0 },
  image: { type: String, default: "" },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "VIA",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    collection: {
      type: String,
      required: [true, "Collection is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL", "XXL"],
    },
    colors: {
      type: [String],
      default: ["Black"],
    },
    variants: [variantSchema],
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    gsm: {
      type: String,
      default: "240 GSM Super Combed Cotton",
    },
    fit: {
      type: String,
      default: "Relaxed Boxy Drop-Shoulder Fit",
    },
    material: {
      type: String,
      default: "100% Super Combed Bio-Washed Cotton",
    },
    specs: {
      type: [String],
      default: [],
    },
    careInstructions: {
      type: [String],
      default: [
        "Machine wash cold inside out with like colors",
        "Do not bleach or dry clean",
        "Tumble dry low or hang dry in shade",
        "Iron inside-out on low heat (do not iron over prints)",
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    bestseller: {
      type: Boolean,
      default: false,
      index: true,
    },
    newArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    limitedEdition: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    ratings: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Indexes for fast sorting and querying without in-memory sort buffer limit
productSchema.index({ createdAt: -1 });
productSchema.index({ active: 1, createdAt: -1 });
productSchema.index({ active: 1, featured: -1, createdAt: -1 });
productSchema.index({ active: 1, bestseller: -1, createdAt: -1 });
productSchema.index({ active: 1, price: 1, createdAt: -1 });
productSchema.index({ active: 1, price: -1, createdAt: -1 });
productSchema.index({ category: 1, createdAt: -1 });

// Full text search index
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  collection: "text",
  tags: "text",
  sku: "text",
});

// Auto-sync total stock from variants if variants exist
productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  }
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

export default mongoose.model("Product", productSchema);
