import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';

const Layout = ({ children, title = 'Bawar Biryani', description = 'Authentic Afghani Biryani' }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
