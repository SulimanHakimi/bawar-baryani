import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-maroon text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-serif font-bold text-saffron">
          Bawar Biryani
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-saffron transition-colors">Home</Link>
          <Link href="/menu" className="hover:text-saffron transition-colors">Menu</Link>
          <Link href="/about" className="hover:text-saffron transition-colors">Our Story</Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/cart" className="relative hover:text-saffron transition-colors">
            <FaShoppingCart size={20} />
            {/* Badge could go here */}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href={user.role === 'admin' ? '/admin/dashboard' : '/profile'} className="flex items-center space-x-2 hover:text-saffron transition-colors">
                <FaUser />
                <span>{user.name}</span>
              </Link>
              <button onClick={logout} className="hover:text-saffron transition-colors">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-secondary text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
