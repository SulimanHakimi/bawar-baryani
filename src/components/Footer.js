const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-serif text-saffron mb-4">Bawar Biryani</h3>
          <p className="text-sm">Taste the Pashtoon hearth — slow-cooked saffron biryani made with love and tradition.</p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/menu" className="hover:text-saffron">Menu</a></li>
            <li><a href="/about" className="hover:text-saffron">About Us</a></li>
            <li><a href="/profile" className="hover:text-saffron">Profile</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <p className="text-sm">Ahmad sha baba mina kabul Afghanistan 1012 Kabul, Afghanistan</p>
          <p className="text-sm">info@bawarbiryani.com</p>
          <p className="text-sm">+93 78 981 4740</p>
        </div>
      </div>
      <div className="text-center mt-8 pt-8 border-t border-gray-800 text-xs">
        &copy; {new Date().getFullYear()} Bawar Biryani. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
