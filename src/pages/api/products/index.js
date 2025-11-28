import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import { protect, admin } from '../../../middleware/auth';
import { runMiddleware } from '../../../lib/runMiddleware';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  if (method === 'GET') {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (method === 'POST') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;
      await runMiddleware(req, res, admin);
      if (res.headersSent) return;

      const product = new Product(req.body);
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
