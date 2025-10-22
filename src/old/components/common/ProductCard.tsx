import { Link } from 'react-router-dom';
import type { ProductCardProps } from '../../types/ProductsTypes';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const savingsPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link to={product.path} className="group block border rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {savingsPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {savingsPercent}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white truncate group-hover:text-orange-600">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};