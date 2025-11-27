const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, optionalAuth, admin } = require('../middleware/auth');

// @route   POST /api/orders
router.post('/', optionalAuth, async (req, res) => {
  const {
    items,
    shippingAddress,
    totalAmount,
    pointsRedeemed,
    guestInfo,
    paymentMethod,
    deliveryType,
    deliveryFee,
    notes
  } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const orderData = {
      items,
      shippingAddress,
      totalAmount,
      pointsRedeemed: pointsRedeemed || 0,
      paymentMethod: paymentMethod || 'cash',
      deliveryType: deliveryType || 'home_delivery',
      deliveryFee: deliveryFee || 30,
      notes
    };

    // If user is authenticated, add user ID
    if (req.user) {
      orderData.user = req.user._id;
    } else if (guestInfo) {
      // Guest checkout
      orderData.guestInfo = guestInfo;
    } else {
      return res.status(400).json({ message: 'User information required' });
    }

    const order = new Order(orderData);

    // Calculate points earned (e.g., 1 point per 10 AFN spent) - only for registered users
    if (req.user) {
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
    } else {
      // Guest order - no points
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Order creation error:', error);
    
    // Return validation errors if they exist
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
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

// @route   GET /api/orders/:id (Admin - Get single order details)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price image');
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
