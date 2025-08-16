import axios from 'axios';

const api = axios.create({
  baseURL: 'https://yotaperformanceshop.com/yps_server/',
  withCredentials: true,

});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data, error.config?.url);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.log('Unauthorized access');
    } else if (error.response?.status === 500) {
      // Server error
      console.log('Server error occurred');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error - provide more specific error message
      console.log('Request timeout - server took too long to respond');
      error.message = 'Request timed out. The server is taking too long to respond. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

export default api; 