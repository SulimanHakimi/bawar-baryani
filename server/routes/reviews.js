const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get all reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review (protected)
router.post('/', protect, async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
