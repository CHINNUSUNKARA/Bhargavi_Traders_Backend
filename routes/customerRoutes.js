const express = require('express');
const Customer =require("../models/customerSchema") ;

const router = express.Router();
router.post('/register', async (req, res) => {
  const { name, email, password, contact, phone, address } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) return res.status(400).json({ message: 'Email already registered' });

    const newCustomer = new Customer({ name, email, password, contact, phone, address });
    await newCustomer.save();

    res.status(201).json({ message: 'Customer registered successfully', customerId: newCustomer._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // You can generate JWT token here if needed, for now just send success response
    res.status(200).json({ message: 'Login successful', customerId: customer._id, name: customer.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/customers
// @desc    Create a new customer
router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   GET /api/customers
// @desc    Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/customers/:id
// @desc    Get a single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update a customer
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete a customer
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error saving new customer:', error.message);
    res.status(500).json({ error: 'Failed to save new customer', details: error.message });
  }
};

