import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
           {/* Placeholder for hero image. In production, use a real image */}
           <div className="w-full h-full bg-gradient-to-r from-maroon to-black"></div>
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
            {/* Featured Item 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 bg-gray-200 relative">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Qabili Palau Image</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Qabili Palau</h3>
                <p className="text-gray-600 mb-4">Traditional Afghan rice dish with carrots and raisins.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-maroon">$15.99</span>
                  <button className="btn-secondary text-sm">Add to Cart</button>
                </div>
              </div>
            </div>
             {/* Featured Item 2 */}
             <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Mantu Image</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mantu</h3>
                <p className="text-gray-600 mb-4">Steamed dumplings filled with spiced beef and onions.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-maroon">$12.99</span>
                  <button className="btn-secondary text-sm">Add to Cart</button>
                </div>
              </div>
            </div>
             {/* Featured Item 3 */}
             <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="h-64 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Bolani Image</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Bolani</h3>
                <p className="text-gray-600 mb-4">Stuffed flatbread with potatoes or leeks, served with chutney.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-maroon">$8.99</span>
                  <button className="btn-secondary text-sm">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
