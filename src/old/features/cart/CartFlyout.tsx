import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { QuantityStepper } from './QuantityStepper'; 

interface CartFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartFlyout: React.FC<CartFlyoutProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, removeItem, itemCount, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pb-20 md:pb-0">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Shopping Cart ({itemCount})</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <FaTimes size={24} />
            </button>
          </div>

          {items.length > 0 ? (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-start">
                  <Link to={item.path} onClick={onClose} className="flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  </Link>
                  
                  <div className="flex-grow flex flex-col justify-between h-20">
                    <div>
                      <Link to={item.path} onClick={onClose} className="font-semibold text-gray-800 hover:text-orange-500 transition-colors leading-tight">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-20">
                    <p className="font-bold text-gray-800">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                       <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        size="sm" 
                      />
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <FaTrash size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (

            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <p className="text-lg text-gray-600">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 bg-orange-500 text-white font-bold py-2 px-5 rounded hover:bg-orange-600">
                Continue Shopping
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="p-4 border-t space-y-4 bg-gray-50">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={handleViewCart} className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors">
                  View Cart
                </button>
                <button onClick={handleCheckout} className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};