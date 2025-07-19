import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controller/coupon.controller.js";
const router = express.Router();

router.get("/", protectedRoute, getCoupon);
router.get("/", protectedRoute, validateCoupon);


export default router;
