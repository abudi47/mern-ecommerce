import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to the user who placed the order
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true, // Reference to the product being ordered
        },
        quantity: {
          type: Number,
          required: true, // Quantity of the product being ordered
          min: 1, // Minimum quantity should be 1
        },
        price: {
          type: Number,
          required: true, // Price of the product at the time of order
          min: 0, // Price should not be negative
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true, // Total amount for the order
      min: 0, // Total amount should not be negative
    },
    stripeSessionId: {
      type: String,
      unique: true, // Stripe session ID for payment processing
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
