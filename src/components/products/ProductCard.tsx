import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  path: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const savingsPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link href={product.path} className="product-card group block border rounded-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {savingsPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full pulse-orange">
            {savingsPercent}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 truncate group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};