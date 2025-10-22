import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CheckoutFormValues } from '../../../types/checkout';
import { Input } from '../../../components/ui/Input';

interface Props {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export const Step1Information: React.FC<Props> = ({ register, errors }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Address</h3>
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
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="State" {...register('state')} error={errors.state?.message} />
          <Input
            label="Postal code"
            {...register('postalCode')}
            error={errors.postalCode?.message}
          />
        </div>
      </div>
    </div>
  </div>
);