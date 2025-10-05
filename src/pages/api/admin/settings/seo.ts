import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Mock SEO settings data
const defaultSeoSettings = {
  enabled: true,
  siteName: "EcommercePro",
  metaTitle: "EcommercePro - Your Premier Shopping Destination",
  metaDescription: "Discover amazing products at EcommercePro. Quality items, great prices, fast shipping.",
  metaKeywords: ["ecommerce", "shopping", "online store", "products"],
  ogTitle: "",
  ogDescription: "",
  ogImage: "https://ecommercepro.com/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterSite: "@ecommercepro",
  twitterCreator: "@ecommercepro",
  canonicalUrl: "https://ecommercepro.com",
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://ecommercepro.com/sitemap.xml",
  sitemapEnabled: true,
  sitemapUrl: "/sitemap.xml",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  googleSearchConsoleId: "",
  facebookPixelId: "",
  bingWebmasterToolsId: "",
  schemaOrgType: "Organization",
  schemaOrgData: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EcommercePro",
  "url": "https://ecommercepro.com",
  "logo": "https://ecommercepro.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  }
}`,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Check authorization header
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json({
          success: true,
          data: defaultSeoSettings,
          message: 'SEO settings retrieved successfully'
        });

      case 'PUT':
        console.log('Updating SEO settings...');
        
        const updatedSettings = {
          ...defaultSeoSettings,
          ...req.body,
          updatedAt: new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          data: updatedSettings,
          message: 'SEO settings updated successfully'
        });

      case 'POST':
        console.log('Creating SEO settings...');
        
        const newSettings = {
          ...defaultSeoSettings,
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return res.status(201).json({
          success: true,
          data: newSettings,
          message: 'SEO settings created successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('SEO settings API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}