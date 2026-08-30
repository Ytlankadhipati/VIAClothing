import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, default: "Standard" },
  variantSku: { type: String, default: "" },
  image: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  subtotal: { type: Number, required: true },
  customDetails: { type: mongoose.Schema.Types.Mixed, default: null },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Method to recalculate cart totals safely
cartSchema.methods.recalculate = function () {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Free shipping threshold: Orders over ₹1999 get free shipping, otherwise ₹150
  this.shipping = this.subtotal >= 1999 || this.subtotal === 0 ? 0 : 150;
  this.total = Math.max(0, this.subtotal - this.discount + this.shipping);
};

export default mongoose.model("Cart", cartSchema);
