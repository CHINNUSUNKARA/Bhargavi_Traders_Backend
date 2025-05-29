const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  password: { type: String, required: true }, // Added password field for authentication
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
}, { timestamps: true });

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
