import { toast } from 'react-toastify';

/**
 * Factory that creates a configured API fetch function.
 */
function createApiFetch(tokenStorageKey) {
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  const apiBaseUrl =
    configuredApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://api.theomprajapati.com');

  function getAuthToken() {
    return localStorage.getItem(tokenStorageKey);
  }

  async function apiFetch(url, options = {}) {
    const { suppressToast = false, ...fetchOptions } = options;
    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    const token = getAuthToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const requestUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
      const response = await fetch(requestUrl, { ...fetchOptions, headers });
      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { error: responseText || 'Invalid API response' };
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.message && !suppressToast) {
        toast.success(data.message);
      }

      return data;
    } catch (error) {
      const message =
        error instanceof TypeError && error.message === 'Failed to fetch'
          ? `Could not reach the API at ${apiBaseUrl}. Check VITE_API_BASE_URL or start the API server.`
          : error.message;

      if (!suppressToast) {
        toast.error(message);
      }

      throw new Error(message);
    }
  }

  apiFetch.baseUrl = apiBaseUrl;

  return apiFetch;
}

/**
 * Admin panel API client — uses 'adminToken' from localStorage.
 */
export const apiFetch = createApiFetch('adminToken');
export const API_BASE_URL = apiFetch.baseUrl;
