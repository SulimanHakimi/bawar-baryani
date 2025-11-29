import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/Order';
import { protect, admin } from '../../../../middleware/auth';
import { runMiddleware } from '../../../../lib/runMiddleware';
import { sendEmail } from '../../../../lib/email';

export default async function handler(req, res) {
  const { query: { id }, method } = req;
  await dbConnect();

  if (method === 'POST') {
    try {
      await runMiddleware(req, res, protect);
      if (res.headersSent) return;
      await runMiddleware(req, res, admin);
      if (res.headersSent) return;

      const { message, subject } = req.body;

      if (!message) {
        return res.status(400).json({ message: 'Message content is required' });
      }

      const order = await Order.findById(id).populate('user');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const email = order.user ? order.user.email : (order.guestInfo ? order.guestInfo.email : null);

      if (!email) {
        return res.status(400).json({ message: 'No email address found for this order' });
      }

      await sendEmail({
        to: email,
        subject: subject || `Message regarding Order #${order._id}`,
        html: `
          <h1>Message from Bawar Biryani</h1>
          <p>Regarding Order #${order._id}</p>
          <div style="padding: 15px; border-left: 4px solid #ccc; background-color: #f9f9f9;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        `
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
