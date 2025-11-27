import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaBox, FaUsers, FaClipboardList, FaChartLine } from 'react-icons/fa';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(process.env.API_URL+'/admin/stats', config);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchStats();
      }
    }
  }, [user, authLoading]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-maroon">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold">{stats?.totalRevenue.toFixed(2)} AFN</h3>
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
                    <h3 className="text-2xl font-bold">{stats?.orderCount}</h3>
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
                    <h3 className="text-2xl font-bold">{stats?.userCount}</h3>
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
                    <h3 className="text-2xl font-bold">{stats?.productCount}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full text-green-500">
                    <FaBox size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h3 className="text-xl font-bold mb-4">Sales Overview</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Mon', sales: 4000 },
                    { name: 'Tue', sales: 3000 },
                    { name: 'Wed', sales: 2000 },
                    { name: 'Thu', sales: 2780 },
                    { name: 'Fri', sales: 1890 },
                    { name: 'Sat', sales: 2390 },
                    { name: 'Sun', sales: 3490 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
        </main>
      </div>
    </Layout>
  );
}
