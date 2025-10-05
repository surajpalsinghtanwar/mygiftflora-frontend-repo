import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Mock integration settings data
const defaultIntegrationSettings = {
  googleAnalyticsEnabled: false,
  googleAnalyticsId: "",
  googleTagManagerEnabled: false,
  googleTagManagerId: "",
  facebookPixelEnabled: false,
  facebookPixelId: "",
  googleLoginEnabled: false,
  googleClientId: "",
  googleClientSecret: "",
  facebookLoginEnabled: false,
  facebookAppId: "",
  facebookAppSecret: "",
  chatbotEnabled: false,
  chatbotProvider: "none",
  chatbotConfig: {},
  slackEnabled: false,
  slackWebhookUrl: "",
  discordEnabled: false,
  discordWebhookUrl: "",
  zendeskEnabled: false,
  zendeskSubdomain: "",
  zendeskApiToken: "",
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
          data: defaultIntegrationSettings,
          message: 'Integration settings retrieved successfully'
        });

      case 'PUT':
        console.log('Updating integration settings...');
        
        const updatedSettings = {
          ...defaultIntegrationSettings,
          ...req.body,
          updatedAt: new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          data: updatedSettings,
          message: 'Integration settings updated successfully'
        });

      case 'POST':
        console.log('Creating integration settings...');
        
        const newSettings = {
          ...defaultIntegrationSettings,
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return res.status(201).json({
          success: true,
          data: newSettings,
          message: 'Integration settings created successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Integration settings API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}