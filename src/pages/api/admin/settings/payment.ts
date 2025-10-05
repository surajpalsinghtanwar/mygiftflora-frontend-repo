import type { NextApiRequest, NextApiResponse } from 'next';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Mock payment settings data
const defaultPaymentSettings = {
  enabled: true,
  currency: "USD",
  taxRate: 0,
  processingFee: 0,
  stripeEnabled: false,
  stripePublishableKey: "",
  stripeSecretKey: "",
  paypalEnabled: false,
  paypalClientId: "",
  paypalClientSecret: "",
  paypalSandbox: true,
  razorpayEnabled: false,
  razorpayKeyId: "",
  razorpayKeySecret: "",
  minimumOrderAmount: 0,
  maximumOrderAmount: 10000,
  refundPolicy: "All refunds will be processed within 7-14 business days. Items must be returned in original condition.",
  shippingEnabled: true,
  freeShippingThreshold: 100,
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
          data: defaultPaymentSettings,
          message: 'Payment settings retrieved successfully'
        });

      case 'PUT':
        console.log('Updating payment settings...');
        
        const updatedSettings = {
          ...defaultPaymentSettings,
          ...req.body,
          updatedAt: new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          data: updatedSettings,
          message: 'Payment settings updated successfully'
        });

      case 'POST':
        console.log('Creating payment settings...');
        
        const newSettings = {
          ...defaultPaymentSettings,
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return res.status(201).json({
          success: true,
          data: newSettings,
          message: 'Payment settings created successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Payment settings API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}