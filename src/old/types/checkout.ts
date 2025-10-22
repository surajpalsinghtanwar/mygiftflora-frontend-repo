import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),

  country: z.string().min(1, 'Country is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  
  shippingMethod: z.enum(['standard', 'express'], {
    required_error: 'You need to select a shipping method.',
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;