import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../../hooks/useWishlist';
import type { ProductDetailData } from '../../types/ProductsTypes';

interface WishlistButtonProps {
  product: ProductDetailData;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ product }) => {
  const { addItem, removeItem, isOnWishlist } = useWishlist();
  const isItemOnWishlist = isOnWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (isItemOnWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:text-orange-500 transition-all duration-300 transform hover:scale-110`}
      title={isItemOnWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      {isItemOnWishlist ? (
        <FaHeart size={20} className="text-orange-500" />
      ) : (
        <FaRegHeart size={20} />
      )}
    </button>
  );
};