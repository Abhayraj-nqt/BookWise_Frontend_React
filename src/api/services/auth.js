import { get, post, put, del } from '../apiClient';
import { API_LOGIN, API_CURRENT_USER } from '../apiConstants/auth'

export const login = async (data) => {
    return await post(API_LOGIN, data);
}

export const getCurrentUser = async () => {
    return await get(API_CURRENT_USER);
}

export const logout = () => {
    window.localStorage.removeItem('authtoken');
}