import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Checkout() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Guest info for non-logged-in users
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  
  // Enhanced address fields
  const [address, setAddress] = useState({ 
    fullName: '',
    phone: '',
    street: '', 
    area: '',
    city: '', 
    province: '',
    province: '',
    country: 'Afghanistan',
    landmark: '',
    latitude: null,
    longitude: null
  });
  
  // Payment and delivery options
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryType, setDeliveryType] = useState('home_delivery');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    setTotal(sum);
    
    // Pre-fill user info if logged in
    if (user) {
      setAddress(prev => ({
        ...prev,
        fullName: user.name || '',
      }));
    }
  }, [user, router]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = response.data;
        setAddress(prev => ({
          ...prev,
          street: data.address.road || '',
          area: data.address.neighbourhood || data.address.suburb || '',
          city: data.address.city || data.address.town || data.address.village || '',
          province: data.address.state || '',
          province: data.address.state || '',
          country: data.address.country || 'Afghanistan',
          latitude,
          longitude
        }));
      } catch (error) {
        console.error('Error fetching location:', error);
        alert('Could not fetch address details. Please fill manually.');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Geolocation error:', error);
      alert('Unable to retrieve your location');
      setLoading(false);
    });
  };

  const deliveryFee = deliveryType === 'home_delivery' ? 30 : 0;
  const finalTotal = (total + deliveryFee) - (pointsToRedeem * 0.1);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          options: []
        })),
        shippingAddress: address,
        totalAmount: finalTotal,
        pointsRedeemed: pointsToRedeem,
        paymentMethod,
        deliveryType,
        deliveryFee,
        notes
      };

      // Add guest info if not logged in
      if (!user) {
        orderData.guestInfo = guestInfo;
      }

      const config = user ? {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      } : {};

      const response = await axios.post(process.env.API_URL+'/orders', orderData, config);
      
      localStorage.removeItem('cart');
      router.push(`/order-confirmation/${response.data._id}`);
    } catch (error) {
      console.error('Order failed:', error);
      alert(error.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maxRedeemable = user ? Math.min(user.points, Math.floor(total * 10)) : 0;

  return (
    <Layout title="Checkout | Bawar Biryani">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {/* Guest Information (if not logged in) */}
              {!user && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h2 className="text-xl font-bold mb-4">Your Information</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      required
                      className="w-full border p-3 rounded"
                      value={guestInfo.name}
                      onChange={e => setGuestInfo({...guestInfo, name: e.target.value})}
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      className="w-full border p-3 rounded"
                      value={guestInfo.email}
                      onChange={e => setGuestInfo({...guestInfo, email: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      className="w-full border p-3 rounded"
                      value={guestInfo.phone}
                      onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <Link href="/register" className="text-blue-600 underline">Create an account</Link> to track your orders and earn rewards!
                  </p>
                </div>
              )}



              {/* Shipping Address */}
              {deliveryType === 'home_delivery' && (
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Delivery Address</h2>
                    <button 
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loading}
                      className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      Use my location
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      required
                      className="w-full border p-3 rounded"
                      value={address.fullName}
                      onChange={e => setAddress({...address, fullName: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      className="w-full border p-3 rounded"
                      value={address.phone}
                      onChange={e => setAddress({...address, phone: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Street Address *"
                      required
                      className="w-full border p-3 rounded"
                      value={address.street}
                      onChange={e => setAddress({...address, street: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Area/Neighborhood"
                      className="w-full border p-3 rounded"
                      value={address.area}
                      onChange={e => setAddress({...address, area: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        className="w-full border p-3 rounded"
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Province"
                        className="w-full border p-3 rounded"
                        value={address.province}
                        onChange={e => setAddress({...address, province: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Country"
                        required
                        className="w-full border p-3 rounded"
                        value={address.country}
                        onChange={e => setAddress({...address, country: e.target.value})}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Nearby Landmark (e.g., Near Blue Mosque)"
                      className="w-full border p-3 rounded"
                      value={address.landmark}
                      onChange={e => setAddress({...address, landmark: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold">Cash on Delivery</span>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
                <textarea
                  placeholder="Any special requests? (e.g., extra spicy, no onions, etc.)"
                  className="w-full border p-3 rounded"
                  rows="3"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {/* Points Redemption (only for logged-in users) */}
              {user && user.points > 0 && (
                <div className="bg-saffron/10 p-6 rounded-lg border border-saffron">
                  <h3 className="font-bold text-maroon mb-2">Redeem Points</h3>
                  <p className="text-sm mb-2">You have {user.points} points. (10 points = 1.00 AFN)</p>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="range" 
                      min="0" 
                      max={maxRedeemable} 
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="font-bold">{pointsToRedeem} pts</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Discount: -{(pointsToRedeem * 0.1).toFixed(2)} AFN</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>{(item.product.price * item.quantity).toFixed(2)} AFN</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} AFN</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee.toFixed(2)} AFN</span>
                </div>
                {pointsToRedeem > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Points Discount</span>
                    <span>-{(pointsToRedeem * 0.1).toFixed(2)} AFN</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} AFN</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full mt-6 py-4 text-lg"
              >
                {loading ? 'Processing...' : `Place Order (${finalTotal.toFixed(2)} AFN)`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
