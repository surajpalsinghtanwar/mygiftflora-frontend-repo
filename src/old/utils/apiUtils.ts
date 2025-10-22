
import type { ApiResponse } from '../types/ProductsTypes'; 

/**
 * A generic helper to handle a standard API response structure.
 * It checks for network errors and application-level errors (where success: false).
 * 
 * @param response The raw Response object from a `fetch` call.
 * @returns A Promise that resolves with the nested `data` payload from the API response on success.
 * @throws An `Error` if the network response is not 'ok' OR if the API response envelope has `success: false`.
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  // 1. Check for network-level errors (e.g., 404 Not Found, 500 Server Error)
  if (!response.ok) {
    throw new Error(`Network error: ${response.statusText} (Status: ${response.status})`);
  }

  const apiResponse: ApiResponse<T> = await response.json();
  if (apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.message || 'An unknown API error occurred.');
  }
}

// export const getAuthHeaders = (): HeadersInit => {
//   const token = localStorage.getItem('authToken');
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// };