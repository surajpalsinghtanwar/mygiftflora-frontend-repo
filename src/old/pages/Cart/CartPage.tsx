import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { QuantityStepper } from '../../features/cart/QuantityStepper';

export const CartPage: React.FC = () => {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto text-center py-20 px-4">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="relative text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <button onClick={() => navigate(-1)} className="absolute top-1/2 -translate-y-1/2 right-0 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Close cart">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="hidden md:flex p-5 font-bold bg-gray-50 border-b text-gray-500 uppercase text-sm tracking-wider">
                <div className="w-2/5">Product</div>
                <div className="w-1/5 text-center">Price</div>
                <div className="w-1/5 text-center">Quantity</div>
                <div className="w-1/5 text-right">Total</div>
              </div>

              {items.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row items-center p-5 border-b last:border-b-0">
                  <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-5 flex-shrink-0" />
                    <div>
                      <Link to={item.path} className="font-bold text-lg text-gray-800 hover:text-orange-500">{item.name}</Link>
                      <button onClick={() => removeItem(item.id)} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1.5 mt-2">
                        <FaTrash size={14} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/5 text-left md:text-center mb-2 md:mb-0">
                    <span className="md:hidden font-semibold mr-2">Price:</span>
                    <span>₹{item.price.toLocaleString()}</span>
                  </div>
                  <div className="w-full md:w-1/5 flex justify-start md:justify-center items-center mb-4 md:mb-0">
                    <QuantityStepper
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                    />
                  </div>
                 
                  <div className="w-full md:w-1/5 text-left md:text-right font-bold text-lg text-gray-800">
                    <span className="md:hidden font-semibold">Total: </span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/" className="text-orange-500 font-semibold mt-6 inline-block hover:underline">
              ← Continue Shopping
            </Link>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Cart Summary</h2>
              <div className="flex justify-between mb-3 text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-5 text-lg text-gray-500">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <button  onClick={() => navigate('/checkout')} 
              className="w-full mt-8 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 uppercase flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};