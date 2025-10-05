// Utility functions for localStorage in Next.js
// These functions safely handle localStorage access in both client and server environments

export const getFromLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const setToLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Helper to get auth token safely
export const getAuthToken = (): string | null => {
  return getFromLocalStorage('access_token');
};