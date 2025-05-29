// models/Order.js
const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  quantity: Number,
  unitPrice: Number,
});

const orderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  customer: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ["Completed", "Processing", "Shipped", "Delivered"], default: "Processing" },
  paymentStatus: { type: String, enum: ["Paid", "Pending", "Partially Paid"], default: "Pending" },
}, { timestamps: true });

const orderItem = mongoose.model("OrderItem", orderSchema);
module.exports = orderItem;
