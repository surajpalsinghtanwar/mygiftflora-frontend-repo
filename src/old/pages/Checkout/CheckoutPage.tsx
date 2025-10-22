import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import type { CheckoutFormValues } from '../../types/checkout';
import { checkoutSchema } from '../../types/checkout';
import { useCart } from '../../hooks/useCart';
// import { OrderSummary } from '../features/checkout/OrderSummary';
import { Step1Information } from '../../features/checkout/steps/Step1Information';
import { Step2Shipping } from '../../features/checkout/steps/Step2Shipping';
import { Step3Payment } from '../../features/checkout/steps/Step3Payment';
import { OrderSummary } from '../../features/checkout/OrderSummary';


const steps = ['Information', 'Shipping', 'Payment'];

export const CheckoutPage: FC = () => {
  const navigate = useNavigate();
  const { clearCart, subtotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger, // Make sure you destructure 'trigger' from useForm
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    // Use 'onTouched' or 'onChange' to see errors as the user types
    mode: 'onTouched', 
  });

  // --- THIS IS THE KEY FUNCTION FOR VALIDATION ---
  const handleNextStep = async () => {
    // Define which fields are required for the current step
    const fieldsToValidate: (keyof CheckoutFormValues)[] =
      currentStep === 1
        ? ['email', 'country', 'firstName', 'lastName', 'address', 'city', 'state', 'postalCode']
        : ['shippingMethod'];
    
    // Manually trigger validation for those specific fields
    const isValid = await trigger(fieldsToValidate);

    // If validation passes, move to the next step
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Optional: show a toast message if validation fails
      toast.error('Please fill in all required fields.');
    }
  };
  
  const handleFormSubmit = (data: CheckoutFormValues) => {
    // This function is only called on the final step after all validation passes
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Order Submitted:', data);
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/');
        resolve(true);
      }, 1500);
    });
  };

  return (
    <div className="font-sans antialiased">
      <div className="lg:grid lg:grid-cols-2 min-h-screen">
        {/* Left Side: Form */}
        <div className="py-12 px-4 sm:px-6 lg:px-12 xl:px-20 flex flex-col justify-center">
          <div className="max-w-lg mx-auto w-full">
            {/* ... Logo and Step Tabs are unchanged ... */}
            
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {/* The `errors` object is correctly passed down, so no change here */}
              {currentStep === 1 && <Step1Information register={register} errors={errors} />}
              {currentStep === 2 && <Step2Shipping register={register} errors={errors} subtotal={subtotal} />}
              {currentStep === 3 && <Step3Payment />}

              {/* Navigation Buttons */}
              <div className="mt-10 flex items-center justify-end sm:justify-between gap-4">
                 <button type="button" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/cart')} className="text-gray-600 font-semibold hover:text-gray-800">
                  ← {currentStep > 1 ? 'Go Back' : 'Return to Cart'}
                </button>
                {currentStep < 3 ? (
                  // THIS BUTTON NOW CORRECTLY TRIGGERS VALIDATION
                  <button type="button" onClick={handleNextStep} className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors">
                    Continue to {steps[currentStep]}
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]">
                    {isSubmitting ? <FaSpinner className="animate-spin"/> : 'Pay Now'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="hidden lg:block relative border-l">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};