import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OrderDetails() {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  const fetchOrderDetails = async () => {
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else if (id) {
        fetchOrderDetails();
      }
    }
  }, [user, authLoading, id, router, fetchOrderDetails]);

  const updateStatus = async (status) => {
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (authLoading || !user || user.role !== 'admin') return null;
  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>;
  if (!order) return <Layout><div className="p-8">Order not found</div></Layout>;

  const customerInfo = order.user || order.guestInfo;
  const isGuest = !order.user;

  return (
    <Layout title={`Order #${order._id.substring(0, 8)} | Bawar Biryani`}>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-serif font-bold text-maroon">Admin</h2>
          </div>
          <nav className="mt-6">
            <Link href="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Dashboard</Link>
            <Link href="/admin/orders" className="flex items-center px-6 py-3 bg-maroon text-white">Orders</Link>
            <Link href="/admin/menu" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Menu Management</Link>
            <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Users</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-600">Order ID: #{order._id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>
              <select 
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="w-full border rounded p-3 mb-4"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-semibold">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-semibold capitalize">{order.paymentMethod === 'hesabpay' ? 'Hesab Pay' : 'Cash on Delivery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold capitalize">{order.deliveryType === 'home_delivery' ? 'Home Delivery' : 'Pickup'}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Customer Information {isGuest && <span className="text-sm text-orange-600">(Guest)</span>}
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-semibold">{customerInfo?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-semibold">{customerInfo?.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-semibold">{customerInfo?.phone || order.shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{(order.totalAmount - order.deliveryFee + (order.pointsRedeemed * 0.1)).toFixed(2)} AFN</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{order.deliveryFee.toFixed(2)} AFN</span>
                </div>
                {order.pointsRedeemed > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Points Discount:</span>
                    <span>-{(order.pointsRedeemed * 0.1).toFixed(2)} AFN</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>{order.totalAmount.toFixed(2)} AFN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address & Location */}
          {order.deliveryType === 'home_delivery' && (
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Full Name:</span>
                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Phone:</span>
                    <p className="font-semibold">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Street Address:</span>
                    <p className="font-semibold">{order.shippingAddress.street}</p>
                  </div>
                  {order.shippingAddress.area && (
                    <div>
                      <span className="text-gray-600 text-sm">Area/Neighborhood:</span>
                      <p className="font-semibold">{order.shippingAddress.area}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 text-sm">City:</span>
                    <p className="font-semibold">{order.shippingAddress.city}</p>
                  </div>
                  {order.shippingAddress.province && (
                    <div>
                      <span className="text-gray-600 text-sm">Province:</span>
                      <p className="font-semibold">{order.shippingAddress.province}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 text-sm">Country:</span>
                    <p className="font-semibold">{order.shippingAddress.country}</p>
                  </div>
                  {order.shippingAddress.landmark && (
                    <div>
                      <span className="text-gray-600 text-sm">Landmark:</span>
                      <p className="font-semibold">{order.shippingAddress.landmark}</p>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div>
                  {order.shippingAddress.latitude && order.shippingAddress.longitude ? (
                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${order.shippingAddress.longitude-0.01},${order.shippingAddress.latitude-0.01},${order.shippingAddress.longitude+0.01},${order.shippingAddress.latitude+0.01}&layer=mapnik&marker=${order.shippingAddress.latitude},${order.shippingAddress.longitude}`}
                      />
                      <div className="mt-2">
                        <a 
                          href={`https://www.google.com/maps?q=${order.shippingAddress.latitude},${order.shippingAddress.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      No location data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded">
                      {item.product?.image && (
                        <img 
                          src={item.product.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: {item.price.toFixed(2)} AFN each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} AFN</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
              <h2 className="text-xl font-bold mb-2">📝 Special Instructions</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
