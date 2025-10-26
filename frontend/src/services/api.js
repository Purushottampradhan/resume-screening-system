import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants';
import { tokenManager } from '../utils/tokenManager';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = tokenManager.getRefreshToken();
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { headers: { Authorization: `Bearer ${refreshToken}` } }
                );
                tokenManager.setAccessToken(response.data.access_token);
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                tokenManager.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;