import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Endpoint API Laravel
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true, // Untuk mengizinkan kirim cookie auth/sanctum
});

export default api;