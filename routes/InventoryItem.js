const express = require('express');
const router = express.Router();
const InventoryItem = require('../models//inventoryItemSchema');

// ✅ Create new inventory item
router.post('/', async (req, res) => {
  try {
    const item = new InventoryItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create inventory item', error: error.message });
  }
});

// ✅ Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
});

// ✅ Get a single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
});

// ✅ Update an item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error: error.message });
  }
});

// ✅ Delete an item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
});

// ✅ Get low stock items
router.get('/low-stock/all', async (req, res) => {
  try {
    const lowStockItems = await InventoryItem.find({ quantity: { $lt: 100 } });
    res.status(200).json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch low stock items', error: error.message });
  }
});

// ✅ Filter by category or supplier (optional query params)
router.get('/filter', async (req, res) => {
  const { category, supplier } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (supplier) filter.supplier = supplier;

  try {
    const items = await InventoryItem.find(filter);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter items', error: error.message });
  }
});

module.exports = router;
