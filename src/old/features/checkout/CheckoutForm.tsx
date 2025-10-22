import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// --- FIX START ---
// This is now a type-only import. It will be completely erased after compilation.
import type { CheckoutFormValues } from '../../types/checkout'; 
// This is a value import. It will be kept in the compiled JavaScript.
import { checkoutSchema } from '../../types/checkout';
// --- FIX END ---
import { FaLock } from 'react-icons/fa';
import { Input } from '../../components/ui/Input';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({ // <-- CheckoutFormValues is used as a type here
    resolver: zodResolver(checkoutSchema), // <-- checkoutSchema is used as a value here
    defaultValues: {
      country: 'India', 
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Contact Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      {/* Shipping Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <Input
            label="Country"
            {...register('country')}
            error={errors.country?.message}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
          />
          <Input
            label="Apartment, suite, etc. (optional)"
            {...register('apartment')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="State"
              {...register('state')}
              error={errors.state?.message}
            />
            <Input
              label="Postal code"
              {...register('postalCode')}
              error={errors.postalCode?.message}
            />
          </div>
          <div className="flex items-center">
            <input
              id="save-info"
              type="checkbox"
              {...register('saveInfo')}
              className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
            />
            <label htmlFor="save-info" className="ml-2 block text-sm text-gray-700">
              Save this information for next time
            </label>
          </div>
        </div>
      </div>

      {/* Payment - This is a UI mock-up */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment</h2>
        <p className="text-sm text-gray-500 mb-3">All transactions are secure and encrypted.</p>
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Credit Card</p>
            {/* You can add logos for card types here */}
          </div>
          <div className="mt-4 space-y-4">
            <div className="relative">
              <input className="w-full rounded-md border-gray-300 p-3" placeholder="Card number" />
              <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full rounded-md border-gray-300 p-3" placeholder="MM / YY" />
              <input className="w-full rounded-md border-gray-300 p-3" placeholder="CVC" />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-800 text-white font-bold py-4 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};