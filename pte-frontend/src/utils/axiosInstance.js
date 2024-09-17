
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axiosInstance.post('/users/refresh-token'); // Refresh token endpoint
                const { token } = response.data;
                localStorage.setItem('token', token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                // Handle token refresh error
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

