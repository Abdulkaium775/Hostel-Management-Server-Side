import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Ensure the backend URL is correct
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");  // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
