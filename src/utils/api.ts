// API Configuration utilities
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  UPLOADS_BASE_URL: process.env.NEXT_PUBLIC_UPLOADS_BASE_URL || 'http://localhost:8000',
};

// Helper functions for API URLs
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getUploadUrl = (type: 'categories' | 'subcategories' | 'products', filename: string) => {
  return `${API_CONFIG.UPLOADS_BASE_URL}/uploads/${type}/${filename}`;
};