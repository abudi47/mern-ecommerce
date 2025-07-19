import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/", protectedRoute, getCoupon)

export default router;