import dbConnect from '../../../lib/dbConnect';
import Review from '../../../models/Review';
import Product from '../../../models/Product';
import { protect } from '../../../middleware/auth';
import { runMiddleware } from '../../../lib/runMiddleware';
import { cors } from '../../../middleware/cors';

export default async function handler(req, res) {
  // Handle CORS
  const isPreflightHandled = cors(req, res);
  if (isPreflightHandled) return;

  const { method } = req;
  await dbConnect();

  if (method === 'GET') {
    try {
      const reviews = await Review.find()
        .populate('user', 'name')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (method === 'POST') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;

      const { productId, rating, comment } = req.body;
      if (!productId || !rating || !comment) {
        return res.status(400).json({ message: 'All fields required' });
      }

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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
