import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

export const SocialLogins = () => {
  // These onClick handlers are placeholders.
  // In a real app, you'd trigger your social auth flow (e.g., with Firebase, Auth0, etc.)
  const handleGoogleLogin = () => alert('Google login coming soon!');
  const handleFacebookLogin = () => alert('Facebook login coming soon!');
  const handleAppleLogin = () => alert('Apple login coming soon!');

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <FcGoogle size={22} />
        <span className="font-semibold text-gray-700">Continue with Google</span>
      </button>
      <button
        type="button"
        onClick={handleFacebookLogin}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <FaFacebook size={22} className="text-blue-600" />
        <span className="font-semibold text-gray-700">Continue with Facebook</span>
      </button>
      <button
        type="button"
        onClick={handleAppleLogin}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <FaApple size={22} />
        <span className="font-semibold text-gray-700">Continue with Apple</span>
      </button>
    </div>
  );
};