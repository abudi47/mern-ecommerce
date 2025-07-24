import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";
import Order from "../models/order.model.js";
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    let totalAmount = 0;

    const lineItems = products.map((item) => {
      const amount = Math.round(item.product * 100); // Convert to cents
      const totalItemPrice = amount * item.quantity;
      totalAmount += totalItemPrice;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: totalItemPrice,
        },
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (!coupon || coupon.expiryDate < new Date()) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      totalAmount -= Math.round((totalAmount * coupon.discount) / 100); // Apply discount
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: coupon ? coupon._id : null,
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id); // Create a new coupon for the user
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 }); // Return session ID and total amount in dollars
  } catch (error) {
    console.log("Error in createCheckoutSession:", error.message);
    return res
      .status(500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

async function createStripeCoupon(discountPercentage) {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: "once",
    });
    return coupon.id;
  } catch (error) {
    console.error("Error creating Stripe coupon:", error.message);
    throw new Error("Failed to create Stripe coupon");
  }
}

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10, // Example discount
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();
  return newCoupon;
}

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }
    }

    //create a new order
    const products = JSON.parse(session.metadata.products);
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      paymentIntent: session.payment_intent,
      stripeSessionId: sessionId,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message:
        "payment succesful , order created and coupon deactivated if used",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("error processing checkout", error);
    res.status(500).json({
      message: "Error processing checkout ",
      error: error.message,
    });
  }
};
