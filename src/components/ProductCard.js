import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 bg-gray-200 relative">
        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">{product.name}</div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 text-sm flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-maroon">${product.price.toFixed(2)}</span>
          <Link href={`/product/${product._id}`} className="btn-secondary text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
