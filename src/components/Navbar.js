import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Navbar = ({ cartCount = 0 }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-maroon text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-serif font-bold text-saffron">
          Bawar Biryani
        </Link>

        {/* Main navigation links (Desktop) */}
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

        {/* Right side: cart, user, language (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
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
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/cart" className="relative hover:text-saffron transition-colors mr-4">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-maroon border-t border-red-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-saffron" onClick={toggleMenu}>
              {t('home') || 'Home'}
            </Link>
            <Link href="/menu" className="block py-2 hover:text-saffron" onClick={toggleMenu}>
              {t('menu') || 'Menu'}
            </Link>
            <Link href="/about" className="block py-2 hover:text-saffron" onClick={toggleMenu}>
              {t('ourStory') || 'Our Story'}
            </Link>

            {user ? (
              <>
                <div className="border-t border-red-800 my-2 pt-2">
                  <p className="text-sm text-gray-300 mb-2">Signed in as {user.name}</p>
                  {user.role === 'admin' ? (
                    <>
                      <Link href="/admin/dashboard" className="block py-2 hover:text-saffron font-bold" onClick={toggleMenu}>
                        Admin Dashboard
                      </Link>
                      <Link href="/admin/orders" className="block py-2 hover:text-saffron pl-4" onClick={toggleMenu}>
                        Orders
                      </Link>
                      <Link href="/admin/menu" className="block py-2 hover:text-saffron pl-4" onClick={toggleMenu}>
                        Menu Management
                      </Link>
                      <Link href="/admin/users" className="block py-2 hover:text-saffron pl-4" onClick={toggleMenu}>
                        Users
                      </Link>
                    </>
                  ) : (
                    <Link href="/profile" className="block py-2 hover:text-saffron" onClick={toggleMenu}>
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="block w-full text-left py-2 hover:text-saffron mt-2"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-red-800 my-2 pt-2">
                <Link href="/login" className="block py-2 hover:text-saffron" onClick={toggleMenu}>
                  Login / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
