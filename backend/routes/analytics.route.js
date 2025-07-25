import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

import {
  getAnalyticsData,
  getDailySalesData,
} from "../controller/analytics.controller.js"; // Correct the path if needed
const router = express.Router();

router.get("/", protectedRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
