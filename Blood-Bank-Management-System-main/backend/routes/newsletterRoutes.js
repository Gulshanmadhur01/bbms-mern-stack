import express from "express";
import { subscribe, getSubscribers } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/all", getSubscribers); // Should probably be protected by admin middleware

export default router;
