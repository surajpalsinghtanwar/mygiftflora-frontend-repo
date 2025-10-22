import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from 'react-icons/fa';

const TopBar: React.FC = () => (
  <div className="bg-[#333E48] text-white px-4 py-2 text-xs md:text-sm">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <p className="font-medium">FREE SHIPPING ALL OVER INDIA</p>
      <div className="hidden md:flex items-center gap-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gray-300 transition-colors">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gray-300 transition-colors">
          <FaInstagram />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-gray-300 transition-colors">
          <FaTwitter />
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-gray-300 transition-colors">
          <FaPinterest />
        </a>
      </div>
    </div>
  </div>
);

export default TopBar
