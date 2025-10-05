import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Mock security settings data
const defaultSecuritySettings = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  twoFactorEnabled: false,
  ipWhitelist: [],
  enableAuditLog: true,
  forcePasswordChange: 90,
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
          data: defaultSecuritySettings,
          message: 'Security settings retrieved successfully'
        });

      case 'PUT':
        console.log('Updating security settings...');
        
        const updatedSettings = {
          ...defaultSecuritySettings,
          ...req.body,
          updatedAt: new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          data: updatedSettings,
          message: 'Security settings updated successfully'
        });

      case 'POST':
        console.log('Creating security settings...');
        
        const newSettings = {
          ...defaultSecuritySettings,
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return res.status(201).json({
          success: true,
          data: newSettings,
          message: 'Security settings created successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Security settings API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}