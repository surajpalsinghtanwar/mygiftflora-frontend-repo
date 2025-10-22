import { FaLock } from 'react-icons/fa';

export const Step3Payment: React.FC = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Details</h3>
    <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
    <div className="rounded-md border border-gray-300 bg-white p-4">
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
);