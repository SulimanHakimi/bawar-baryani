import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Layout 
      title="About Us | Bawar Biryani - Authentic Afghani Pashtoon Cuisine"
      description="Discover the story behind Bawar Biryani. We bring authentic Afghani Pashtoon flavors to your table with traditional recipes passed down through generations."
    >
      <div className="bg-maroon py-16 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-serif font-bold mb-4"
        >
          Our Story
        </motion.h1>
        <p className="text-xl text-saffron">Celebrating Afghani Pashtoon Heritage Through Food</p>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">The Bawar Tradition</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bawar Biryani was born from a deep love for Afghani Pashtoon culture and cuisine. Our name, "Bawar," means "belief" in Pashto, reflecting our unwavering commitment to authentic flavors and traditional cooking methods.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every dish we serve is prepared using recipes passed down through generations, with slow-cooked saffron rice, tender meats, and aromatic spices that transport you to the heart of Afghanistan.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We honor the Pashtoon tradition of hospitality, welcoming every guest as family and serving food made with love, patience, and respect for our heritage.
            </p>
          </div>
          <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-xl">Traditional Kitchen Image</span>
          </div>
        </div>

        <div className="bg-saffron/10 p-12 rounded-xl border-2 border-saffron mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-8 text-maroon">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="font-bold text-xl mb-2">Authenticity</h3>
              <p className="text-gray-600">Traditional recipes and cooking methods preserved for generations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-bold text-xl mb-2">Quality</h3>
              <p className="text-gray-600">Premium ingredients sourced with care and attention</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-xl mb-2">Hospitality</h3>
              <p className="text-gray-600">Every guest is treated as family in the Pashtoon tradition</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Experience the Pashtoon Hearth</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Join us on a culinary journey through Afghanistan. From our slow-cooked biryanis to our handmade breads, every bite tells a story of tradition, culture, and love.
          </p>
          <a href="/menu" className="btn-primary text-lg">Explore Our Menu</a>
        </div>
      </div>
    </Layout>
  );
}
