const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Register new admin (optional, for setup)
router.post('/register', async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const newAdmin = new Admin({ adminId, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // For now, just return success message and adminId. You can add JWT token here if needed.
    res.status(200).json({ message: 'Login successful', adminId: admin.adminId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
