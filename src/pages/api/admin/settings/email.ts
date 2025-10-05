import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Mock email settings data
const defaultEmailSettings = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: "",
  smtpPassword: "",
  fromEmail: "noreply@ecommercepro.com",
  fromName: "EcommercePro",
  replyToEmail: "support@ecommercepro.com",
  enabled: false,
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
          data: defaultEmailSettings,
          message: 'Email settings retrieved successfully'
        });

      case 'PUT':
        console.log('Updating email settings...');
        
        const updatedSettings = {
          ...defaultEmailSettings,
          ...req.body,
          updatedAt: new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          data: updatedSettings,
          message: 'Email settings updated successfully'
        });

      case 'POST':
        console.log('Creating email settings...');
        
        const newSettings = {
          ...defaultEmailSettings,
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return res.status(201).json({
          success: true,
          data: newSettings,
          message: 'Email settings created successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Email settings API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}