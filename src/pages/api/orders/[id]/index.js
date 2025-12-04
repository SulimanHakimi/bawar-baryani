import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/Order';
import { protect, admin, optionalAuth } from '../../../../middleware/auth';
import { runMiddleware } from '../../../../lib/runMiddleware';
import { cors } from '../../../../middleware/cors';

export default async function handler(req, res) {
  // Handle CORS
  const isPreflightHandled = cors(req, res);
  if (isPreflightHandled) return;

  const { query: { id }, method } = req;
  await dbConnect();

  if (method === 'GET') {
    try {
      await runMiddleware(req, res, optionalAuth);

      const order = await Order.findById(id)
        .populate('user', 'name email phone')
        .populate('items.product', 'name price image');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Access control
      const isAdmin = req.user && req.user.role === 'admin';
      const isOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();
      const isGuestOrder = !order.user; // If order has no user, it's a guest order

      // Allow if admin, owner, or it's a guest order (and user is guest)
      // Note: For guest orders, we allow public access by ID. 
      // Ideally we'd verify a session/cookie, but for now ID knowledge is the key.
      if (isAdmin || isOwner || (isGuestOrder && !req.user)) {
        res.status(200).json(order);
      } else {
        res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
