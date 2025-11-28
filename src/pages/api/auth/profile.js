import dbConnect from '../../../lib/dbConnect';
import { protect } from '../../../middleware/auth';
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

    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
