const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  supplyCategory: { type: String, enum: ["Iron", "Cement", "Masonry"], required: true },
  totalOrders: { type: Number, default: 0 },
  paymentTerms: { type: String, enum: ["Net 30", "Net 15", "COD"], default: "Net 30" },
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
