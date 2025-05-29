const express = require('express');
const Supplier = require('../models/supplierSchema'); // Adjust the path if needed

const router = express.Router();

// @route   POST /api/suppliers
// @desc    Create a new supplier
router.post('/', async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create supplier', error: error.message });
  }
});

// @route   GET /api/suppliers
// @desc    Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch suppliers', error: error.message });
  }
});

// @route   GET /api/suppliers/:id
// @desc    Get a supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch supplier', error: error.message });
  }
});

// @route   PUT /api/suppliers/:id
// @desc    Update a supplier
router.put('/:id', async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) return res.status(404).json({ message: 'Supplier not found' });
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update supplier', error: error.message });
  }
});

// @route   DELETE /api/suppliers/:id
// @desc    Delete a supplier
router.delete('/:id', async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) return res.status(404).json({ message: 'Supplier not found' });
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete supplier', error: error.message });
  }
});

module.exports = router;
