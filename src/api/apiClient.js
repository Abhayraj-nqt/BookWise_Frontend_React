import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_BASE_URL || `http://localhost:8080`

const app = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});


// Request Interceptor
app.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authtoken');
        if (Boolean(token)) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
app.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


// API methods
export const get = async (url, params = {}) => {
    try {
        const response = await app.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('GET Error:', error);
        throw error;
    }
}

export const post = async (url, data = {}) => {
    try {
        const response = await app.post(url, data);
        return response.data;
    } catch (error) {
        console.error('POST Error:', error);
        throw error;
    }
}

export const put = async (url, data = {}) => {
    try {
        const response = await app.put(url, data);
        return response.data;
    } catch (error) {
        console.error('PUT Error:', error);
        throw error;
    }
}

export const del = async (url) => {
    try {
        const response = await app.delete(url);
        return response.data;
    } catch (error) {
        console.error('DELETE Error:', error);
        throw error;
    }
}


export default app;