import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAnnouncement, updateBroadcast } from "../controllers/systemController.js";

const router = express.Router();

router.get("/announcement", getAnnouncement); // Public
router.put("/broadcast", protect, updateBroadcast); // Admin protected

export default router;
