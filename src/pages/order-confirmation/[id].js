import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function OrderConfirmation() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const token = Cookies.get('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        // Try to fetch the order. If the API is protected and user is guest, this might fail.
        // In a real app, we might pass the order object via router state or have a public 'receipt' endpoint.
        // For now, we attempt to fetch.
        const response = await axios.get(`/api/orders/${id}`, config);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not load order details. Please check your email for confirmation.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Order Confirmation | Bawar Biryani">
        <div className="container-custom py-20 text-center">
          <p className="text-xl">Loading receipt...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Order Confirmation | Bawar Biryani">
        <div className="container-custom py-20 text-center">
          <div className="bg-red-50 p-8 rounded-lg inline-block">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Order Placed!</h1>
            <p className="mb-6">{error}</p>
            <Link href="/" className="btn-primary px-8 py-3">
              Return Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  return (
    <Layout title="Order Receipt | Bawar Biryani">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100 print:shadow-none print:border-none">
          <div className="text-center mb-8 border-b pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600">Your order has been placed successfully.</p>
            <p className="text-sm text-gray-500 mt-2">Order ID: {order._id}</p>
          </div>

          <div className="space-y-8">
            {/* Order Items */}
            <div>
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} AFN</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{(order.totalAmount - order.deliveryFee + (order.pointsRedeemed ? order.pointsRedeemed * 0.1 : 0)).toFixed(2)} AFN</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee.toFixed(2)} AFN</span>
              </div>
              {order.pointsRedeemed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Points Discount</span>
                  <span>-{(order.pointsRedeemed * 0.1).toFixed(2)} AFN</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>{order.totalAmount.toFixed(2)} AFN</span>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  {order.shippingAddress.area && <p>{order.shippingAddress.area}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Payment & Method</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>Payment Method: <span className="capitalize">{order.paymentMethod}</span></p>
                  <p>Delivery Type: <span className="capitalize">{order.deliveryType.replace('_', ' ')}</span></p>
                  <p>Status: <span className="capitalize bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">{order.status || 'Pending'}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Print Receipt
            </button>
            <Link href="/" className="btn-primary px-8 py-3 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
