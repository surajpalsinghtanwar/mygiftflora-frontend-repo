import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { registerUser, selectAuthLoading } from './authSlice';
import { registrationSchema, type RegistrationFormValues } from './authTypes';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput';
import { SocialLogins } from './SocialLogins';
import { DividerWithText } from './DividerWithText';

export const SignupForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);

  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = (data: RegistrationFormValues) => {
   toast.promise(
      dispatch(registerUser(data)).unwrap(),
      {
        loading: 'Creating your account...',
        success: 'Account created successfully! Welcome.',
        error: 'Registration failed. An account with this email may already exist.',
      }
    );
  };

  return (
    <div>
      {/* 1. Add Social Logins */}
      <SocialLogins />
      
      {/* 2. Add the "OR" Divider */}
      <DividerWithText>Or create an account with email</DividerWithText>
      
      {/* 3. The Original Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FloatingLabelInput
          id="name"
          label="Full Name"
          type="text"
          error={errors.name}
          {...register('name')}
        />
        <FloatingLabelInput
          id="email"
          label="Email Address"
          type="email"
          error={errors.email}
          {...register('email')}
        />
        <FloatingLabelInput
          id="password"
          label="Password"
          type="password"
          error={errors.password}
          {...register('password')}
        />
        <div>
          <button
            type="submit"
            disabled={loading === 'pending'}
            className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'pending' ? <FaSpinner className="animate-spin text-xl" /> : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};