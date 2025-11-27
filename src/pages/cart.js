import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    calculateTotal(cart);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = [...cartItems];
    newCart[index].quantity = newQuantity;
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  if (cartItems.length === 0) {
    return (
      <Layout title="Cart | Bawar Biryani">
        <div className="container-custom py-20 text-center">
          <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
          <Link href="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cart | Bawar Biryani">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                  <div>
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button 
                      className="px-2 py-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button 
                      className="px-2 py-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Tax (5%)</span>
              <span>${(total * 0.05).toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>${(total * 1.05).toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full block text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
