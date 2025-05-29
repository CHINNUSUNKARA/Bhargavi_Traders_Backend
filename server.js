const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/SupplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/InventoryRoutes'); // Assuming you have an InventoryItem route
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:8080',
  'https://bhargavitraders.vercel.app',
  'https://bhargavi-traders-backend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're using cookies or auth headers
}));app.use(express.json()); 

app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes); // Assuming you have an InventoryItem route

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Server is running ✅');
});
 

app.use((err, req, res,next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
