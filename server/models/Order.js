const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for guest checkout
  guestInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    options: [String]
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    area: String, // Neighborhood/Area
    city: { type: String, required: true },
    province: String,
    zip: String,
    country: { type: String, default: 'Afghanistan' },
    landmark: String, // Nearby landmark for easier delivery
    latitude: Number,
    longitude: Number
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'hesabpay'], 
    default: 'cash',
    required: true 
  },
  deliveryType: {
    type: String,
    enum: ['home_delivery', 'pickup'],
    default: 'home_delivery'
  },
  deliveryFee: { type: Number, default: 30 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  pointsEarned: { type: Number, default: 0 },
  pointsRedeemed: { type: Number, default: 0 },
  notes: String // Special instructions from customer
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
