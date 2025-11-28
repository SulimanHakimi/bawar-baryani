import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/Order';
import { protect, admin } from '../../../../middleware/auth';
import { runMiddleware } from '../../../../lib/runMiddleware';

export default async function handler(req, res) {
  const { query: { id }, method } = req;
  await dbConnect();

  if (method === 'PUT') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;
      await runMiddleware(req, res, admin);
      if (res.headersSent) return;

      const order = await Order.findById(id);
      if (order) {
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
