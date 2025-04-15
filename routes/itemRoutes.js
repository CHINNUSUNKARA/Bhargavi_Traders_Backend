const express = require("express") ;
const router = express.Router();
const mongoose = require("mongoose"); // Example for Mongoose

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true }, // Price per unit
  details: { type: Object, required: true }, // Additional category-specific details
});

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  categories: [categorySchema], // Nested categories
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brands: [brandSchema], // Nested brands
});

const Item = mongoose.model("Item", itemSchema);


// CREATE - Add a new item
router.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: savedItem });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(400).json({ message: "Error creating item", error });
  }
});

// READ - Get all items
router.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error });
  }
});

// READ - Get a single item by ID
router.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ item });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item", error });
  }
});

// UPDATE - Update an item by ID
router.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error });
  }
});

// DELETE - Remove an item by ID
router.delete("/items/:id", async (req, res) => {
  try {
    const removedItem = await Item.findByIdAndRemove(req.params.id);
    if (!removedItem) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted successfully", item: removedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error });
  }
});

// Updated API - Get categories within a brand by name
router.get("/items/:itemId/brands/:brandName/categories", async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const brand = item.brands.find((b) => b.name === req.params.brandName);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.status(200).json({ categories: brand.categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// CREATE - Add a brand to an item
router.post("/items/:id/brands", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.brands.push(req.body); // Add a new brand
    const updatedItem = await item.save();
    res.status(201).json({ message: "Brand added successfully", item: updatedItem });
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ message: "Error adding brand", error });
  }
});

// UPDATE - Update a category within a brand
router.put("/items/:itemId/brands/:brandId/categories/:categoryId", async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const brand = item.brands.id(req.params.brandId);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const category = brand.categories.id(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    Object.assign(category, req.body); // Update category
    await item.save();
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error });
  }
});

// DELETE - Remove a category from a brand
router.delete("/items/:itemId/brands/:brandId/categories/:categoryId", async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const brand = item.brands.id(req.params.brandId);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const categoryIndex = brand.categories.findIndex(
      (c) => c._id.toString() === req.params.categoryId
    );
    if (categoryIndex === -1) return res.status(404).json({ message: "Category not found" });

    brand.categories.splice(categoryIndex, 1); // Remove category
    await item.save();
    res.status(200).json({ message: "Category deleted successfully", item });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error });
  }
});

module.exports = router;