import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to each request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling (e.g., invalid or expired token)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const signupWithFirebase = async (token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE}/auth/firebase-signup`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem('access_token', response.data?.access_token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const get = async (path: string) => {
  return apiClient.get(path);
};

export const post = async (path: string, body = {}) => {
  return apiClient.post(path, body);
};
