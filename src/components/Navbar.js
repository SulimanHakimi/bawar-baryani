import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = ({ cartCount = 0 }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-maroon text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-serif font-bold text-saffron">
          Bawar Biryani
        </Link>

        {/* Main navigation links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-saffron transition-colors">
            {t('home') || 'Home'}
          </Link>
          <Link href="/menu" className="hover:text-saffron transition-colors">
            {t('menu') || 'Menu'}
          </Link>
          <Link href="/about" className="hover:text-saffron transition-colors">
            {t('ourStory') || 'Our Story'}
          </Link>
        </div>

        {/* Right side: cart, user, language */}
        <div className="flex items-center space-x-6">
          {/* Cart icon with badge */}
          <Link href="/cart" className="relative hover:text-saffron transition-colors">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User auth links */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                className="flex items-center space-x-1 hover:text-saffron transition-colors"
              >
                <FaUser size={18} />
              </Link>
              <button onClick={logout} className="hover:text-saffron transition-colors flex items-center space-x-1">
                <FaSignOutAlt size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-1 hover:text-saffron transition-colors">
              <FaUser size={18} />
            </Link>
          )}

          {/* Language selector */}
          {/* <select
            onChange={e => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-gray-800 text-white border border-saffron rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-saffron"
          >
            <option value="en">English</option>
            <option value="ps">Pashto</option>
          </select> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
