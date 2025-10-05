import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import topBannerData from '../data/topBanner.json';

interface TopBannerLink {
  text: string;
  url: string;
}

interface TopBannerItem {
  id: number;
  text: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  links: TopBannerLink[];
}

interface TopBannerResponse {
  success: boolean;
  data: TopBannerItem[];
  message: string;
}

const TopHeader: React.FC = () => {
  const [bannerData, setBannerData] = useState<TopBannerItem | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate API call - in future replace with actual API
    const response: TopBannerResponse = topBannerData as TopBannerResponse;
    
    if (response.success && response.data.length > 0) {
      // Get the first active banner
      const activeBanner = response.data.find(banner => banner.isActive) || response.data[0];
      setBannerData(activeBanner);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!bannerData || !isVisible) {
    return null;
  }

  return (
    <>
      <div 
        className="top-banner"
        style={{
          background: bannerData.backgroundColor,
          color: bannerData.textColor
        }}
      >
        <div className="container">
          <div className="banner-content">
            <div className="banner-text-wrapper">
              <span className="banner-text">{bannerData.text}</span>
            </div>
            
            <div className="banner-actions">
              <div className="top-links">
                {bannerData.links.map((link, index) => (
                  <Link 
                    key={index} 
                    href={link.url}
                    className="top-link"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
              
              <button 
                className="close-banner"
                onClick={handleClose}
                aria-label="Close banner"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .top-banner {
          position: relative;
          padding: 8px 0;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .top-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .banner-text-wrapper {
          flex: 1;
          text-align: center;
        }

        .banner-text {
          font-weight: 500;
          line-height: 1.4;
          display: inline-block;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .top-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .top-link {
          color: inherit;
          text-decoration: none;
          opacity: 0.9;
          transition: all 0.3s ease;
          font-size: 13px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid transparent;
        }

        .top-link:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .close-banner {
          background: none;
          border: none;
          color: inherit;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.3s ease;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-left: 10px;
        }

        .close-banner:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(90deg);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .top-banner {
            font-size: 12px;
            padding: 6px 0;
          }

          .banner-content {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .banner-actions {
            gap: 15px;
          }

          .top-links {
            gap: 15px;
          }

          .top-link {
            font-size: 12px;
            padding: 3px 6px;
          }

          .banner-text {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 15px;
          }

          .banner-content {
            gap: 6px;
          }

          .banner-actions {
            flex-direction: column;
            gap: 8px;
          }

          .top-links {
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default TopHeader;