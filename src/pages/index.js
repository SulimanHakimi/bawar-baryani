import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  // ----- Products -----
  const [products, setProducts] = useState([]);
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.API_URL}/products`);
      setProducts(data);
    } catch (e) {
      console.error('Error fetching products', e);
    }
  }, []);

  // ----- Reviews -----
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.API_URL}/reviews`);
      setReviews(data.slice(0, 6));
    } catch (e) {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  // ----- Add‑to‑Cart -----
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((i) => (i.product?._id || i.productId) === product._id);
    if (idx !== -1) cart[idx].quantity += 1;
    else cart.push({ product: { _id: product._id, name: product.name, price: product.price, image: product.image }, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  // ----- Effects -----
  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, [fetchProducts, fetchReviews]);

  // ----- Helper for stars -----
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));

  return (
    <Layout title="Home | Bawar Biryani">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image src="/background.png" alt="bg-hero" fill style={{ objectFit: 'cover' }} className="bg-gradient-to-r from-maroon to-black" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-saffron">
            Bawar Biryani
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 font-light">
            This biryani was made to be shared with friends — big plates, loud laughs, hands reaching everywhere. Come hungry, leave happy!
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Link href="/menu" className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
              Order Biryani
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-serif text-center mb-12 text-maroon">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(products) && products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover absolute"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-maroon">{product.price.toFixed(2)} AFN</span>
                    <button onClick={() => addToCart(product)} className="btn-secondary text-sm">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-maroon mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real reviews from real biryani lovers</p>
          </div>
          {loadingReviews ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to share your experience!</p>
              <Link href="/menu" className="btn-primary">Order Now</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, idx) => (
                <motion.div key={review._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-maroon text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">{review.user?.name || 'Anonymous'}</h4>
                      <div className="flex text-lg">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
