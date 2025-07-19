import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    }); //

    res
      .status(200)
      .json(coupon ? coupon : { message: "No active coupon found" });
  } catch (error) {
    console.log("Error in getCoupon:", error.message);
    res.status(500).json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

export const validateCoupon = async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({
    code: code,
    userId: req.user._id,
    isActive: true,
  });

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found or inactive" });
  }
  if (coupon.expiryDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    return res.status(400).json({ message: "Coupon has expired" });
  }

  res.status(201).json({
    message: "coupon is valid",
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  });
};
