import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const role = localStorage.getItem('user_role');
        const userId = localStorage.getItem('user_id');
        if (role) {
            config.headers['X-User-Role'] = role;
        }
        if (userId) {
            config.headers['X-User-Id'] = userId;
        }
    }
    return config;
});

export default api;
