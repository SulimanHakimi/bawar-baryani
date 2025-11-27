import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import axios from 'axios';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <Layout title="Menu | Bawar Biryani">
      <div className="bg-maroon py-12 text-center text-white">
        <h1 className="text-4xl font-serif font-bold">Our Menu</h1>
        <p className="mt-4 text-lg text-saffron">Authentic flavors from the heart of Afghanistan</p>
      </div>

      <div className="container-custom py-12">
        {loading ? (
          <div className="text-center py-20">Loading menu...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
