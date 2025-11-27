import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaBox, FaUsers, FaClipboardList, FaChartLine } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchStats();
      }
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (authLoading || !user || user.role !== 'admin') return null;

  return (
    <Layout title="Admin Dashboard | Bawar Biryani">
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-serif font-bold text-maroon">Admin</h2>
          </div>
          <nav className="mt-6">
            <Link href="/admin/dashboard" className="flex items-center px-6 py-3 bg-maroon text-white">
              <FaChartLine className="mr-3" /> Dashboard
            </Link>
            <Link href="/admin/orders" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
              <FaClipboardList className="mr-3" /> Orders
            </Link>
            <Link href="/admin/menu" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
              <FaBox className="mr-3" /> Menu Management
            </Link>
            <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
              <FaUsers className="mr-3" /> Users
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
          
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-maroon">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="bg-maroon/10 p-3 rounded-full text-maroon">
                    <FaChartLine size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-saffron">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
                  </div>
                  <div className="bg-saffron/10 p-3 rounded-full text-saffron">
                    <FaClipboardList size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats.userCount}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full text-blue-500">
                    <FaUsers size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Menu Items</p>
                    <h3 className="text-2xl font-bold">{stats.productCount}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full text-green-500">
                    <FaBox size={24} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading stats...</div>
          )}
        </main>
      </div>
    </Layout>
  );
}
