import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

export default function AdminMenu() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', image: '', calories: '', ingredients: ''
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchProducts();
      }
    }
  }, [user, authLoading]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/products/${id}`, config);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      calories: Number(formData.calories),
      ingredients: formData.ingredients.split(',').map(i => i.trim())
    };

    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProduct._id}`, productData, config);
      } else {
        await axios.post('/api/products', productData, config);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const startEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      calories: product.calories,
      ingredients: product.ingredients.join(', ')
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', image: '', calories: '', ingredients: '' });
  };

  if (authLoading || !user || user.role !== 'admin') return null;

  return (
    <Layout title="Manage Menu | Bawar Biryani">
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-serif font-bold text-maroon">Admin</h2>
          </div>
          <nav className="mt-6">
            <Link href="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Dashboard</Link>
            <Link href="/admin/orders" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Orders</Link>
            <Link href="/admin/menu" className="flex items-center px-6 py-3 bg-maroon text-white">Menu Management</Link>
            <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Users</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Menu</h1>

          {/* Form */}
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" required className="border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Category" required className="border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <input type="number" placeholder="Price" required className="border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input type="number" placeholder="Calories" className="border p-2 rounded" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} />
              <input type="text" placeholder="Image URL" required className="border p-2 rounded" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              <input type="text" placeholder="Ingredients (comma separated)" className="border p-2 rounded" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} />
              <textarea placeholder="Description" required className="border p-2 rounded md:col-span-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <div className="md:col-span-2 flex space-x-4">
                <button type="submit" className="btn-primary flex items-center"><FaPlus className="mr-2" /> {isEditing ? 'Update' : 'Add'} Product</button>
                {isEditing && <button type="button" onClick={resetForm} className="text-gray-500">Cancel</button>}
              </div>
            </form>
          </div>
          
          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.price}AFN</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => startEdit(product)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
