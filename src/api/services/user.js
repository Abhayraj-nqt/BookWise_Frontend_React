import { get, post, put, del } from '../apiClient';
import { API_REGISTER, API_USER, API_USERS, API_USER_HISTORY } from '../apiConstants/user'


// GET users
export const getUserByMobile = async (mobile) => {
    return await get(`${API_USER}/${mobile}`)
}

export const getAllUsers = async (params) => {
    return get(API_USERS, params);
}

// CREATE user
export const registerUser = async (user) => {
    return await post(API_REGISTER, user);
}

// UPDATE user
export const updateUser = async (mobile, user) => {
    return await put(`${API_USER}/${mobile}`, user);
}

// DELETE user
export const removeUser = async (mobile) => {
    return await del(`${API_USER}/${mobile}`);
}

// USER History
export const getUserHistory = async (mobile, params) => {
    return await get(`${API_USER_HISTORY}/${mobile}`, params);
}
