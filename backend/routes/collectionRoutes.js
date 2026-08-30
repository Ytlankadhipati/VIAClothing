import express from "express";
import { getCollections, createCollection } from "../controllers/collectionController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCollections);
router.post("/", protect, adminOnly, createCollection);

export default router;
