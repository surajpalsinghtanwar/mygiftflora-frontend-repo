import { Link } from 'react-router-dom';

import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { BsHeartbreak } from 'react-icons/bs';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

export const WishlistPage: React.FC = () => {
  const { items, removeItem } = useWishlist();
  const { addItem: addItemToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    addItemToCart(product, 1);
    removeItem(product.id);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto text-center py-20 px-4">
        <BsHeartbreak size={60} className="text-gray-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Your Wishlist is Empty</h1>
        <p className="mt-4 text-gray-600">Looks like you haven't added anything yet.</p>
        <Link to="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <Link to={`/product/${item.id}`} className="block">
                <img src={item.images[0]} alt={item.name} className="w-full h-56 object-cover" />
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 flex-grow">
                  <Link to={`/product/${item.id}`} className="hover:text-orange-500">{item.name}</Link>
                </h2>
                <p className="text-xl font-bold text-gray-900 mt-2">₹{item.price.toLocaleString()}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart size={16} /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-500 transition"
                    title="Remove from Wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};