import { useState } from 'react';
import type { ProductInfoProps } from '../../types/ProductsTypes';
import { useCart } from '../../hooks/useCart';
import { WishlistButton } from '../wishlist/WishlistButton';

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const savings = product.originalPrice - product.price;
  const savingsPercent = Math.round((savings / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  const handleBuyNow = () => {
    addItem(product, quantity);
    // navigate('/checkout');
    console.log(`Buying ${quantity} of ${product.name} now.`);
  };

  return (
    <div className="flex flex-col relative"> 
      <div className="absolute top-0 right-0">
        <WishlistButton product={product} />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.name}</h1>
      <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
      
      <div className="flex items-baseline gap-4 mt-4">
        <span className="text-3xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
        <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
      </div>
      <p className="text-green-600 font-semibold mt-1">You save ₹{savings.toLocaleString()} ({savingsPercent}%)</p>

      <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{product.shortDescription}</p>

      <div className="flex items-center gap-4 mt-6">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg">-</button>
          <span className="px-4 py-1 font-semibold">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 text-lg">+</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <button onClick={handleAddToCart} className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition uppercase tracking-wider">Add to Cart</button>
        <button onClick={handleBuyNow} className="w-full bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition uppercase tracking-wider">Buy Now</button>
      </div>
      
    </div>
  );
};