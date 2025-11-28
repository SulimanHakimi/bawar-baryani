import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
import User from '../../../models/User';
import { optionalAuth, admin, protect } from '../../../middleware/auth';
import { runMiddleware } from '../../../lib/runMiddleware';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  if (method === 'POST') {
    try {
      await runMiddleware(req, res, optionalAuth);
      
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

      if (req.user) {
        orderData.user = req.user._id;
      } else if (guestInfo) {
        orderData.guestInfo = guestInfo;
      } else {
        return res.status(400).json({ message: 'User information required' });
      }

      const order = new Order(orderData);

      if (req.user) {
        const pointsEarned = Math.floor(totalAmount / 10);
        order.pointsEarned = pointsEarned;

        const createdOrder = await order.save();

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
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else if (method === 'GET') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;
      await runMiddleware(req, res, admin);
      if (res.headersSent) return;

      const orders = await Order.find({}).populate('user', 'id name');
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
