import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CheckoutFormValues } from '../../../types/checkout';
import { FaCheckCircle } from 'react-icons/fa';

interface Props {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  subtotal: number;
}

const SHIPPING_COST = 50;
const FREE_SHIPPING_THRESHOLD = 500;

export const Step2Shipping: React.FC<Props> = ({ register, errors, subtotal }) => {
  const isFreeShipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Method</h3>
      <div className="space-y-4">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:border-gray-800 has-[:checked]:ring-2 has-[:checked]:ring-gray-800 has-[:checked]:bg-gray-50 transition-all">
          <input type="radio" value="standard" {...register('shippingMethod')} className="hidden" />
          <div className="flex-grow flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">Standard Shipping</p>
              <p className="text-sm text-gray-500">4-6 business days</p>
            </div>
            <p className={`font-semibold ${isFreeShipping ? 'text-green-600' : 'text-gray-800'}`}>
              {isFreeShipping ? 'FREE' : `₹${SHIPPING_COST.toLocaleString()}`}
            </p>
          </div>
          <FaCheckCircle className="ml-4 text-gray-800 text-xl opacity-0 checked:opacity-100 transition-opacity" />
        </label>
        
        {/* You can add more options like this */}
        <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:border-gray-800 has-[:checked]:ring-2 has-[:checked]:ring-gray-800 has-[:checked]:bg-gray-50 transition-all">
          <input type="radio" value="express" {...register('shippingMethod')} className="hidden" />
          <div className="flex-grow flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">Express Shipping</p>
              <p className="text-sm text-gray-500">1-2 business days</p>
            </div>
            <p className="font-semibold text-gray-800">₹150.00</p>
          </div>
          <FaCheckCircle className="ml-4 text-gray-800 text-xl opacity-0 checked:opacity-100 transition-opacity" />
        </label>
      </div>
      {errors.shippingMethod && <p className="mt-2 text-sm text-red-500">{errors.shippingMethod.message}</p>}
    </div>
  );
};