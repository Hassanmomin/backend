require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(error => {
    console.log('MongoDB Connection Error:', error);
  });

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    bookTitle: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

// Order Model
const Order = mongoose.model('Order', orderSchema);

// POST API - Save Order
app.post('/orders', async (req, res) => {
  try {
    const {name, address, bookTitle, price} = req.body;

    if (
      !name?.trim() ||
      !address?.trim() ||
      !bookTitle?.trim() ||
      price === undefined
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const order = new Order({
      name: name.trim(),
      address: address.trim(),
      bookTitle: bookTitle.trim(),
      price: Number(price),
    });

    await order.save();

    res.status(201).json({
      message: 'Order saved successfully',
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to save order',
    });
  }
});

// Home API
app.get('/', (req, res) => {
  res.json({
    message: 'ShopApp API is running',
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});