import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import axios from 'axios';
import { FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);



  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => {
      const itemId = item.product?._id || item.productId;
      return itemId === product._id;
    });
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ 
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image
        },
        quantity 
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    // Show toast notification
    setToastMessage(`${quantity}x ${product.name} added to cart!`);
    setShowToast(true);
  };


  if (loading) return <Layout><div className="text-center py-20">Loading...</div></Layout>;
  if (!product) return <Layout><div className="text-center py-20">Product not found</div></Layout>;

  return (
    <>
      <Toast 
        message={toastMessage} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <Layout title={`${product.name} | Bawar Biryani`}>
      <div className="container-custom py-12 min-h-[80vh] ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-xl h-96 flex items-center justify-center">
             <img src={product.image} alt={product.name} className="w-full h-full object-contain"/>
          </div>
          
          <div>
            <h1 className="text-4xl font-serif font-bold text-maroon mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-900 mb-6">{product.price.toFixed(2)} AFN</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            
            <div className="mb-8">
              <h3 className="font-bold mb-2">Ingredients:</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">{ing}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <FaMinus size={12} />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button 
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FaPlus size={12} />
                </button>
              </div>
              
              <button 
                onClick={addToCart}
                className="btn-primary flex items-center space-x-2 flex-grow justify-center"
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Calories: {product.calories} kcal</p>
              <p>Category: {product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}
