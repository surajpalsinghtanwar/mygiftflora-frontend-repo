import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginUser, selectAuthLoading } from './authSlice';
import { loginSchema, type LoginFormValues } from './authTypes';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput';
import { SocialLogins } from './SocialLogins';
import { DividerWithText } from './DividerWithText';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
     toast.promise(
      dispatch(loginUser(data)).unwrap(),
      {
        loading: 'Signing in...',
        success: (result) => {
          // On success, navigate the user to their account page or the homepage
          navigate('/account'); // Or navigate('/')
          return `Welcome back, ${result.user.name}!`;
        },
        error: 'Login failed. Please check your credentials.',
      }
    );
  };

  return (
    <div>
      {/* 1. Add Social Logins */}
      <SocialLogins />

      {/* 2. Add the "OR" Divider */}
      <DividerWithText>Or continue with email</DividerWithText>

      {/* 3. The Original Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            {loading === 'pending' ? <FaSpinner className="animate-spin text-xl" /> : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
};