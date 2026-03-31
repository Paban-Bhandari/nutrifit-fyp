import axios from 'axios';

/**
 * Axios instance configured for NutriFit backend.
 * Uses session-based authentication (Django sessions via cookies).
 * withCredentials ensures session cookies are sent with every request.
 */
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Required for Django session auth
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

/**
 * Response interceptor to handle common error cases.
 * 401 means session expired — redirect only if not already on /login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or not authenticated
      if (!window.location.pathname.includes('/login')) {
        // Clear any stale auth data from localStorage
        localStorage.removeItem('nutrifit_user');
        localStorage.removeItem('nutrifit_profile');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
