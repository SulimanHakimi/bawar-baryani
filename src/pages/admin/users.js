import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchUsers();
      }
    }
  }, [user, authLoading]);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') return null;

  return (
    <Layout title="Manage Users | Bawar Biryani">
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-serif font-bold text-maroon">Admin</h2>
          </div>
          <nav className="mt-6">
            <Link href="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Dashboard</Link>
            <Link href="/admin/orders" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Orders</Link>
            <Link href="/admin/menu" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">Menu Management</Link>
            <Link href="/admin/users" className="flex items-center px-6 py-3 bg-maroon text-white">Users</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
          
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
}
