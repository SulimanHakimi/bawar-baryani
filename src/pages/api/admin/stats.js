import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { protect, admin } from '../../../middleware/auth';
import { runMiddleware } from '../../../lib/runMiddleware';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect();

  try {
    await runMiddleware(req, res, protect);
    if (res.headersSent) return;
    await runMiddleware(req, res, admin);
    if (res.headersSent) return;

    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
      userCount,
      orderCount,
      productCount,
      totalRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
