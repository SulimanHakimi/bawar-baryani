import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Checkout() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [address, setAddress] = useState({ street: '', city: '', zip: '', country: 'Afghanistan' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    setTotal(sum);
  }, []);

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
          city: data.address.city || data.address.town || data.address.village || '',
          zip: data.address.postcode || '',
          country: data.address.country || 'Afghanistan'
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

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!user) {
      router.push('/login?redirect=checkout');
      return;
    }

    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          options: []
        })),
        shippingAddress: address,
        totalAmount: (total + 30) - (pointsToRedeem * 0.1), 
        pointsRedeemed: pointsToRedeem
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      localStorage.removeItem('cart');
      router.push('/profile');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maxRedeemable = user ? Math.min(user.points, Math.floor(total * 10)) : 0; // Can't redeem more than total

  return (
    <Layout title="Checkout | Bawar Biryani">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Shipping Address</h2>
              <button 
                type="button"
                onClick={handleGetLocation}
                className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
              >
                Use my current location
              </button>
            </div>
            <form onSubmit={handleOrder} className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                required
                className="w-full border p-2 rounded"
                value={address.street}
                onChange={e => setAddress({...address, street: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="w-full border p-2 rounded"
                  value={address.city}
                  onChange={e => setAddress({...address, city: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  required
                  className="w-full border p-2 rounded"
                  value={address.zip}
                  onChange={e => setAddress({...address, zip: e.target.value})}
                />
              </div>
              <input
                type="text"
                placeholder="Country"
                required
                className="w-full border p-2 rounded"
                value={address.country}
                onChange={e => setAddress({...address, country: e.target.value})}
              />

              {user && user.points > 0 && (
                <div className="mt-6 bg-saffron/10 p-4 rounded border border-saffron">
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

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full mt-6"
              >
                {loading ? 'Processing...' : `Place Order (${((total + 30) - (pointsToRedeem * 0.1)).toFixed(2)} AFN)`}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg h-fit">
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
                <span>30.00 AFN</span>
              </div>
              {pointsToRedeem > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Points Discount</span>
                  <span>-{(pointsToRedeem * 0.1).toFixed(2)} AFN</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{((total + 30) - (pointsToRedeem * 0.1)).toFixed(2)} AFN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
