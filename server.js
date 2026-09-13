require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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

const Order = mongoose.model('Order', orderSchema);

app.get('/', (req, res) => {
  res.json({
    message: 'ShopApp API is running',
  });
});

app.post('/orders', async (req, res) => {
  try {
    console.log('ORDER BODY:', req.body);

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

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({
        message: 'Price must be a valid number',
      });
    }

    const order = new Order({
      name: name.trim(),
      address: address.trim(),
      bookTitle: bookTitle.trim(),
      price: numericPrice,
    });

    await order.save();

    console.log('ORDER SAVED:', order);

    res.status(201).json({
      message: 'Order saved successfully',
      order,
    });
  } catch (error) {
    console.log('ORDER ERROR:', error);

    res.status(500).json({
      message: 'Failed to save order',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB Connection Error:', error);
  });