import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [products, setProducts] = useState(null);  
    const fetchProduct = useCallback(async () => {
      try {
        const { data } = await axios.get(`${process.env.API_URL}/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }, []);
  
    useEffect(() => {
      fetchProduct();
    }, [fetchProduct]);
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <Image src={"/background.png"} alt='bg-hero' fill style={{ objectFit: 'cover' }} className="bg-gradient-to-r from-maroon to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-saffron"
          >
            Bawar Biryani
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 font-light"
          >
            Taste the Pashtoon hearth — slow-cooked saffron biryani made with love and tradition.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/menu" className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
              Order Biryani
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-serif text-center mb-12 text-maroon">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {
              products && products.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <div className="h-64 bg-gray-200 relative">
                      <Image 
                        src={(() => {
                          const url = product.image;
                          if (!url) return '/images/placeholder.jpg';
                          if (url.startsWith('http')) return url;
                          let cleanUrl = url.replace(/\\/g, '/');
                          if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
                          return cleanUrl;
                        })()}
                        alt={product.name} 
                        layout="fill" 
                        objectFit="cover" 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-maroon">{product.price.toFixed(2)} AFN</span>
                        <button className="btn-secondary text-sm">Add to Cart</button>
                      </div>
                    </div>
                </div>
              ))
            }
            
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-maroon mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real reviews from real biryani lovers</p>
          </div>
          
          <CustomerReviews />
        </div>
      </section>
    </Layout>
  );
}

// Customer Reviews Component
function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(process.env.API_URL+"/reviews");
      setReviews(data.slice(0, 6)); // Show only latest 6 reviews
      setLoading(false);
    } catch (error) {
      setReviews([])
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <p className="text-gray-600 mb-4">No reviews yet. Be the first to share your experience!</p>
        <Link href="/menu" className="btn-primary">
          Order Now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-maroon text-white rounded-full flex items-center justify-center font-bold text-xl">
              {review.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-4">
              <h4 className="font-bold">{review.user?.name || 'Anonymous'}</h4>
              <div className="flex text-lg">
                {renderStars(review.rating)}
              </div>
            </div>
          </div>
          <p className="text-gray-700 italic">&quot;{review.comment}&quot;</p>
          <p className="text-sm text-gray-500 mt-4">
            {new Date(review.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
