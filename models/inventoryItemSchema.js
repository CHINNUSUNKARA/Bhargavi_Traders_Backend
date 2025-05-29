// models/InventoryItem.js
const mongoose = require("mongoose");
const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Iron", "Cement", "Masonry"], required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  supplier: { type: String, required: true },
  lowStockThreshold: { type: Number, default: 100 },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const inventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);
module.exports = inventoryItem;