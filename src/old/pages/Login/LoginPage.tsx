// import { Link } from 'react-router-dom'

// export const LoginPage = () => (
//   <div className="max-w-md mx-auto p-4">
//     <h1 className="text-2xl font-bold mb-4">Login</h1>
//     <form className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-4">
//       <input
//         type="email"
//         placeholder="Email"
//         className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition"
//       >
//         Login
//       </button>
//       <div className="flex flex-col gap-2 mt-2">
//         <button
//           type="button"
//           className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//         >
//           <img
//             src="https://www.svgrepo.com/show/475656/google-color.svg"
//             alt="Google"
//             className="w-5 h-5"
//           />
//           <span>Continue with Google</span>
//         </button>
//         <button
//           type="button"
//           className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//         >
//           <img
//             src="https://www.svgrepo.com/show/512120/facebook-176.svg"
//             alt="Facebook"
//             className="w-5 h-5"
//           />
//           <span>Continue with Facebook</span>
//         </button>
//         <button
//           type="button"
//           className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//         >
//           <img
//             src="https://www.svgrepo.com/show/452255/apple.svg"
//             alt="Apple ID"
//             className="w-5 h-5"
//           />
//           <span>Continue with Apple ID</span>
//         </button>
//       </div>
//       <Link to="/signup" className="text-blue-600 hover:underline text-sm">
//         Don't have an account? Sign up
//       </Link>
//     </form>
//   </div>
// )

// export default Login
import { useState } from 'react';
import { LoginForm } from '../../features/auth/LoginForm';
import { SignupForm } from '../../features/auth/SignupForm';
// import { LoginForm } from '../features/auth/LoginForm';
// import { SignupForm } from '../features/auth/SignupForm';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';

export const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  const isLoginMode = mode === 'login';

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* Left Side: The Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {isLoginMode ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLoginMode ? "Or " : "Already have an account? "}
              <button onClick={toggleMode} className="font-medium text-orange-600 hover:text-orange-500">
                {isLoginMode ? 'create an account' : 'sign in'}
              </button>
            </p>
          </div>

          <div className="mt-8">
            {/* The form components will now contain the social logins */}
            {isLoginMode ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      </div>

      {/* Right Side: The Image */}
      <div className="hidden lg:block relative">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImageUrl}
          alt="Beautifully furnished room"
        />
      </div>
    </div>
  );
};