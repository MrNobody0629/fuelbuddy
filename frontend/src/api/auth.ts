import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

