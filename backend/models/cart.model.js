import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
