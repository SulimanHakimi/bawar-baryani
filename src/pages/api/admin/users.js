import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
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

    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
