const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
  const {
    items,
    shippingAddress,
    totalAmount,
    pointsRedeemed
  } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      pointsRedeemed
    });

    // Calculate points earned (e.g., 1 point per $10 spent)
    const pointsEarned = Math.floor(totalAmount / 10);
    order.pointsEarned = pointsEarned;

    const createdOrder = await order.save();

    // Update user points
    const user = await User.findById(req.user._id);
    if (pointsRedeemed > 0) {
      user.points -= pointsRedeemed;
      user.pointsHistory.push({ amount: -pointsRedeemed, reason: 'Order Redemption' });
    }
    user.points += pointsEarned;
    user.pointsHistory.push({ amount: pointsEarned, reason: 'Order Earned' });
    await user.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status (Admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
