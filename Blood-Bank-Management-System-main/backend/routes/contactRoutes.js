import express from "express";
import { sendMessage, getMessages } from "../controllers/contactController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/all", getMessages); // Should probably be protected by admin middleware

export default router;
