import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Mock default settings data
const defaultSettings = {
  id: "platform-settings-1",
  siteName: "EcommercePro",
  logoUrl: "/logo.png",
  darkLogoUrl: "/logo-dark.png",
  siteUrl: "https://ecommercepro.com",
  contact: {
    email: "contact@ecommercepro.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, City, State 12345",
    supportEmail: "support@ecommercepro.com",
    supportPhone: "+1 (555) 123-4568"
  },
  social: {
    facebook: "https://facebook.com/ecommercepro",
    twitter: "https://twitter.com/ecommercepro",
    instagram: "https://instagram.com/ecommercepro",
    linkedin: "https://linkedin.com/company/ecommercepro",
    youtube: "https://youtube.com/ecommercepro"
  },
  seo: {
    metaTitle: "EcommercePro - Your Premier Shopping Destination",
    metaDescription: "Discover amazing products at EcommercePro. Quality items, great prices, fast shipping.",
    metaKeywords: ["ecommerce", "shopping", "online store", "products"],
    ogImage: "https://ecommercepro.com/og-image.jpg",
    favicon: "/favicon.ico"
  },
  theme: {
    primaryColor: "#007bff",
    secondaryColor: "#6c757d", 
    fontFamily: "Inter, Arial, sans-serif",
    logoWidth: 150,
    logoHeight: 50
  },
  maintenance: {
    enabled: false,
    message: "We're currently performing maintenance. Please check back soon."
  },
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: ""
    }
  },
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: new Date().toISOString()
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
        // Fetch platform settings
        console.log('Fetching platform settings...');
        
        return res.status(200).json({
          success: true,
          data: defaultSettings,
          message: 'Platform settings retrieved successfully'
        });

      case 'PUT':
        // Update platform settings
        console.log('Updating platform settings...');
        console.log('Request body type:', typeof req.body);
        console.log('Request headers:', req.headers);

        let updateData: any = {};

        // Handle different content types
        if (req.headers['content-type']?.includes('multipart/form-data')) {
          // For file uploads with FormData
          console.log('Processing FormData...');
          
          // In a real implementation, you'd parse FormData here
          // For now, return success with current settings
          updateData = {
            ...defaultSettings,
            updatedAt: new Date().toISOString()
          };
        } else {
          // For JSON data
          updateData = {
            ...defaultSettings,
            ...req.body,
            updatedAt: new Date().toISOString()
          };
        }

        console.log('Settings updated successfully');
        
        return res.status(200).json({
          success: true,
          data: updateData,
          message: 'Platform settings updated successfully'
        });

      case 'POST':
        // Create initial settings (for first-time setup)
        console.log('Creating initial platform settings...');
        
        const newSettings = {
          ...defaultSettings,
          ...req.body,
          id: `platform-settings-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return res.status(201).json({
          success: true,
          data: newSettings,
          message: 'Platform settings created successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Platform settings API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}