import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
import { protect, admin } from '../../../middleware/auth';
import { runMiddleware } from '../../../lib/runMiddleware';
import { cors } from '../../../middleware/cors';

export default async function handler(req, res) {
  // Handle CORS
  const isPreflightHandled = cors(req, res);
  if (isPreflightHandled) return;

  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const product = await Product.findById(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('GET_PRODUCT_ERROR:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else if (method === 'PUT') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;
      await runMiddleware(req, res, admin);
      if (res.headersSent) return;

      const product = await Product.findById(id);
      if (product) {
        for (const key in req.body) {
          if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            product[key] = req.body[key];
          }
        }
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('UPDATE_PRODUCT_ERROR:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, error: error.errors });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else if (method === 'DELETE') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;
      await runMiddleware(req, res, admin);
      if (res.headersSent) return;

      const product = await Product.findById(id);
      if (product) {
        await product.deleteOne();
        res.status(200).json({ message: 'Product removed' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('DELETE_PRODUCT_ERROR:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
