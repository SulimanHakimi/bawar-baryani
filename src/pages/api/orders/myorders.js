import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/Order';
import { protect } from '../../../middleware/auth';
import { runMiddleware } from '../../../lib/runMiddleware';
import { cors } from '../../../middleware/cors';

export default async function handler(req, res) {
  // Handle CORS
  const isPreflightHandled = cors(req, res);
  if (isPreflightHandled) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect();

  try {
    await runMiddleware(req, res, protect);
    if (res.headersSent) return;

    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
