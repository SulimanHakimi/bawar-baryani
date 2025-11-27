import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(process.env.API_URL+'/orders/myorders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (authLoading || !user) return <Layout><div className="text-center py-20">Loading...</div></Layout>;

  return (
    <Layout title="My Profile | Bawar Biryani">
      <div className="container-custom py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-serif font-bold mb-4">Welcome, {user.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-saffron/10 p-6 rounded-lg border border-saffron">
              <h3 className="font-bold text-maroon text-lg mb-2">My Points</h3>
              <p className="text-4xl font-bold text-maroon">{user.points}</p>
              <p className="text-sm text-gray-600 mt-2">Earn 1 point for every 100AFN spent.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-700 text-lg mb-2">Account Info</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 capitalize">Role: {user.role}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold mb-6">Order History</h2>
        {loading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold">Order #{order._id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm mb-1">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}AFN</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed">
                    <span>Total</span>
                    <span>{order.totalAmount.toFixed(2)}AFN</span>
                  </div>
                  {order.pointsEarned > 0 && (
                    <p className="text-xs text-green-600 mt-2">+ {order.pointsEarned} points earned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
