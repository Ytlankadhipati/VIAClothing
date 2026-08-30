import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getInventory,
  updateInventory,
  getAdminCoupons,
  createAdminCoupon,
  deleteAdminCoupon,
  uploadImage,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/customers", getAllCustomers);
router.get("/inventory", getInventory);
router.put("/inventory/:id", updateInventory);

// Admin Coupon Management
router.get("/coupons", getAdminCoupons);
router.post("/coupons", createAdminCoupon);
router.delete("/coupons/:id", deleteAdminCoupon);

// Cloudinary / Image Upload
router.post("/upload", upload.single("image"), uploadImage);

export default router;
